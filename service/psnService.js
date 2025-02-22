import { searchGamesByNames } from './igdbService.js';
import {
  exchangeCodeForAccessToken,
  exchangeNpssoForCode,
  getProfileFromAccountId,
  getProfileFromUserName,
  getUserFriendsAccountIds,
  getUserTitles,
  makeUniversalSearch,
  getUserTrophiesEarnedForTitle,
  getTitleTrophies,
} from "psn-api";
import query from '../db/index.js';

export const getPSNUserData = async (userId, userPsn, NPSSO) => {
  try {
    const accessCode = await exchangeNpssoForCode(NPSSO);
    const authorization = await exchangeCodeForAccessToken(accessCode);
    const response = await getProfileFromUserName(authorization, userPsn);

    if (!response.profile) {
      throw new Error('No profile data found.');
    }

    const updatedPsnAvatar = response.profile.avatarUrls?.find(url => url.size === "l")?.avatarUrl || null;
    const updatedTrophies = response.profile.trophySummary;
    const updatedPsnPlus = response.profile.plus === 1;

    const updateQuery = `
      UPDATE users 
      SET 
        "psnAvatar" = $2,
        trophies = $3, 
        "psnPlus" = $4
      WHERE id = $1
    `;

    await query(updateQuery, [
      userId,
      updatedPsnAvatar,
      JSON.stringify(updatedTrophies),
      updatedPsnPlus,
    ]);

    return { message: 'User Data Updated Successfully!', profile: response.profile };
  } catch (error) {
    console.error('Error in getPSNUserData:', error);
    throw new Error('Failed to Fetch and Update PSN User Data.');
  }
}

export const getPSNUserFriends = async (userId, userPsn, NPSSO) => {
  try {
    const accessCode = await exchangeNpssoForCode(NPSSO);
    const authorization = await exchangeCodeForAccessToken(accessCode);

    const searchResults = await makeUniversalSearch(authorization, userPsn, "SocialAllAccounts");
    const foundAccountId = searchResults.domainResponses[0].results[0].socialMetadata.accountId;

    const userFriends = await getUserFriendsAccountIds(authorization, foundAccountId);

    const friendsData = await Promise.all(
      userFriends.friends.map(async (accountId) => {
        if (!accountId) {
          return { psnAccountId: null, username: "Unknown", avatarUrl: null };
        }

        try {
          const profile = await getProfileFromAccountId(authorization, accountId);
          return {
            psnAccountId: accountId,
            username: profile.onlineId,
            avatarUrl: profile.avatars?.[2]?.url || null,
          };
        } catch (profileError) {
          console.error(`Error fetching profile for ${accountId}:`, profileError.message);
          return { psnAccountId: accountId, username: 'Error Fetching', avatarUrl: null };
        }
      })
    );

    const psnUsernames = friendsData.map((friend) => friend.username);
    const existingUsersQuery = `
        SELECT psn 
        FROM users 
        WHERE psn = ANY($1)
      `;
    const existingUsersResult = await query(existingUsersQuery, [psnUsernames]);
    const existingUsernames = new Set(existingUsersResult.rows.map((user) => user.psn));

    const insertValues = [];
    const updateValues = [];

    friendsData.forEach((friend) => {
      const pszUser = existingUsernames.has(friend.username);

      insertValues.push(
        `('${userId}', '${friend.psnAccountId}', '${friend.username}', '${friend.avatarUrl}', ${pszUser})`
      );

      updateValues.push(
        `('${friend.avatarUrl}', ${pszUser}, '${friend.username}', '${userId}', '${friend.psnAccountId}')`
      );
    });

    if (insertValues.length > 0) {
      const insertQuery = `
          INSERT INTO friends (
            "userId", 
            "psnAccountId", 
            "username", 
            "avatarUrl", 
            "pszUser"
          )
          VALUES ${insertValues.join(", ")}
          ON CONFLICT (
            "userId", 
            "psnAccountId"
          ) 
          DO UPDATE SET 
            "avatarUrl" = EXCLUDED."avatarUrl",
            "pszUser" = EXCLUDED."pszUser",
            "username" = EXCLUDED."username"
        `;
      await query(insertQuery);
    }

    const fetchFriendsQuery = `
      SELECT 
        F.*, 
        U.id AS "pszUserId"
      FROM friends F
      LEFT JOIN users U 
      ON F."username" = U."psn"
      WHERE F."userId" = $1
    `;
    const savedFriendsResult = await query(fetchFriendsQuery, [userId]);

    return savedFriendsResult.rows;
  } catch (error) {
    console.error('Error in getPSNUserFriends:', error);
    throw new Error('Failed to fetch PSN User Friends.');
  }
};

export const getPSNUserGames = async (userId, userPsn, NPSSO) => {
  try {
    const accessCode = await exchangeNpssoForCode(NPSSO);
    const authorization = await exchangeCodeForAccessToken(accessCode);

    const allAccountsSearchResults = await makeUniversalSearch(
      authorization,
      userPsn,
      "SocialAllAccounts"
    );

    if (
      !allAccountsSearchResults.domainResponses ||
      !allAccountsSearchResults.domainResponses.length ||
      !allAccountsSearchResults.domainResponses[0].results ||
      !allAccountsSearchResults.domainResponses[0].results.length
    ) {
      return res.status(404).json({ error: 'User not found or no PSN account linked.' });
    }

    const targetAccountId = allAccountsSearchResults.domainResponses[0].results[0].socialMetadata.accountId;
    const { trophyTitles } = await getUserTitles(authorization, targetAccountId, { limit: 800 });
    const userPS5Games = trophyTitles.filter(game => game.trophyTitlePlatform?.toUpperCase() === "PS5" && !game.hiddenFlag);

    const insertValues = [];
    const updateValues = [];
    let missingGames = [];
    let gameDataMap = {};

    for (const game of userPS5Games) {
      const existingGame = await query(
        `SELECT "id", "year", "igdbId" FROM games WHERE "psnId" = $1`,
        [game.npCommunicationId]
      );

      if (existingGame.rows.length > 0) {
        gameDataMap[game.npCommunicationId] = {
          year: existingGame.rows[0].year,
          igdbId: existingGame.rows[0].igdbId,
        };
      } else {
        missingGames.push({
          psnId: game.npCommunicationId,
          name: game.trophyTitleName,
        });
        gameDataMap[game.npCommunicationId] = {
          year: null,
          igdbId: null,
        };
      }
    }

    if (missingGames.length > 0) {
      const normalizeGameName = (name) => {
        return name
          .replace(/[’]/g, "'")
          .replace(/[®™]/g, "")
          .replace(/\s*:\s*/g, ": ")
          .trim();
      };

      const normalizedMissingGames = missingGames.map(game => ({
        ...game,
        normalizedName: normalizeGameName(game.name),
      }));

      console.log(normalizedMissingGames)
      const igdbResults = await searchGamesByNames(normalizedMissingGames.map(game => game.normalizedName));
    
      for (const game of normalizedMissingGames) {  
        const igdbGame = igdbResults.shift();  
    
        if (!igdbGame) {
          console.error(`ERROR: IGDB match not found for ${game.name}`);
          continue;
        }
    
        const releaseYear = igdbGame.first_release_date
          ? (typeof igdbGame.first_release_date === "string"
            ? parseInt(igdbGame.first_release_date.split("-")[0], 10)
            : new Date(igdbGame.first_release_date * 1000).getFullYear())
          : null;
        const igdbId = igdbGame.igdbId;
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
        console.log(igdbGame)
        console.log("IGDBID: ", igdbId)

        gameDataMap[game.psnId] = {
          year: releaseYear,
          igdbId: igdbId,
        };

        try {
          await query(
            `INSERT INTO games ("psnId", "name", "year", "igdbId") 
             VALUES ($1, $2, $3, $4) 
             ON CONFLICT ("psnId") DO NOTHING`,
            [game.psnId, game.name, releaseYear, igdbId]
          );
        } catch (error) {
          console.error(`ERROR inserting ${game.mame}:`, error);
        }
      }
    }

    const gamesWithTrophies = await Promise.all(
      userPS5Games.map(async (game) => {
        try {
          const releaseYear = gameDataMap[game.npCommunicationId]?.year || null;

          const titleTrophies = await getTitleTrophies(
            authorization,
            game.npCommunicationId,
            "all"
          );

          const userTrophyData = await getUserTrophiesEarnedForTitle(
            authorization,
            targetAccountId,
            game.npCommunicationId,
            "all"
          );

          const earnedTrophyMap = new Map(
            userTrophyData.trophies.map(trophy => [trophy.trophyId, trophy.earned])
          );

          const trophies = titleTrophies.trophies
            .filter(trophy => !trophy.trophyHidden)
            .map(trophy => ({
              id: trophy.trophyId,
              name: trophy.trophyName || "Unknown Trophy",
              image: trophy.trophyIconUrl || null,
              type: trophy.trophyType,
              earned: earnedTrophyMap.get(trophy.trophyId) || false,
              rarity: trophy.trophyEarnedRate
            }));

          const earnedTrophies = userTrophyData.trophies.reduce(
            (acc, trophy) => {
              if (trophy.earned) {
                acc[trophy.trophyType]++;
              }
              return acc;
            },
            { bronze: 0, silver: 0, gold: 0, platinum: 0 }
          );

          const platinum = earnedTrophies.platinum > 0;

          const escapeSQL = (str) => {
            if (!str) return "NULL";
            return str.replace(/'/g, "''");
          };

          insertValues.push(
            `('${userId}', '${game.npCommunicationId}', '${escapeSQL(game.trophyTitleName)}', 
            '${escapeSQL(game.trophyTitleIconUrl)}', ${game.progress}, ${platinum}, 
            '${escapeSQL(JSON.stringify(earnedTrophies))}'::jsonb, 
            '${escapeSQL(JSON.stringify(trophies))}'::jsonb, 
            ${releaseYear},
            'active')`
          );

          updateValues.push(
            `('${escapeSQL(game.trophyTitleIconUrl)}', ${game.progress}, ${platinum}, 
            '${escapeSQL(JSON.stringify(earnedTrophies))}'::jsonb, 
            '${escapeSQL(JSON.stringify(trophies))}'::jsonb, 
            '${escapeSQL(game.trophyTitleName)}', '${userId}', '${game.npCommunicationId}')`
          );

          return {
            psnId: game.npCommunicationId,
            name: game.trophyTitleName,
            image: game.trophyTitleIconUrl,
            progress: game.progress,
            earnedTrophies,
            platinum,
            year: releaseYear,
            trophies,
          };
        } catch (err) {
          return {
            psnId: game.npCommunicationId,
            name: game.trophyTitleName,
            image: game.trophyTitleIconUrl,
            progress: game.progress,
            earnedTrophies,
            platinum: false,
            year: null,
            error: err.message,
          };
        }
      })
    );

    if (insertValues.length > 0) {
      const insertQuery = `
        INSERT INTO collection (
          "userId", 
          "psnId", 
          "name", 
          "image", 
          "progress", 
          "platinum", 
          "earnedTrophies", 
          "trophies", 
          "year",
          "status"
        )
        VALUES ${insertValues.join(", ")}
        ON CONFLICT ("userId", "psnId") 
        DO UPDATE SET 
          "image" = EXCLUDED."image",
          "progress" = EXCLUDED."progress",
          "platinum" = EXCLUDED."platinum",
          "earnedTrophies" = EXCLUDED."earnedTrophies",
          "trophies" = EXCLUDED."trophies",
          "year" = EXCLUDED."year",
          "name" = EXCLUDED."name"
      `;
      await query(insertQuery);
    }

    return gamesWithTrophies;
  } catch (error) {
    console.error('Error in getPSNUserGames:', error);
    throw new Error('An error occurred while fetching user games and trophies.');
  }
};

export const psnController = {
  getPSNUserData,
  getPSNUserFriends,
  getPSNUserGames,
}