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

export const getPSNUserData = async (req, res) => {
  // const psn = req.body.psn;
  const psn = 'The_Real_Zanatos'
  const NPSSO = process.env.NPSSO

  if (!NPSSO) {
    return res.status(500).json({ error: "NPSSO token is missing in environment variables." });
  }

  try {
    const accessCode = await exchangeNpssoForCode(NPSSO);
    const authorization = await exchangeCodeForAccessToken(accessCode);
    const response = await getProfileFromUserName(
      authorization,
      psn
    )

    res.json(response)
  } catch (error) {
    console.error("Error in getPSNUserGames:", error);
    res.status(500).json({ error: "An error occurred while fetching user games.", details: error.message });
  }
}

export const getPSNUserFriends = async (req, res) => {
  // const { userId } = req.params;
  const userPsn = 'The_Real_Zanatos';
  const NPSSO = process.env.NPSSO;

  if (!NPSSO) {
    return res.status(500).json({ error: "NPSSO token is missing in environment variables." });
  }

  try {
    // const userCheckQuery = `SELECT psn FROM users WHERE id = $1`;
    // const userResult = await query(userCheckQuery, [userId]);
    const userCheckQuery = `
      SELECT id 
      FROM users 
      WHERE psn = $1
    `;
    const userResult = await query(userCheckQuery, [userPsn]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    // const userPsn = userResult.rows[0].psn;
    const userId = userResult.rows[0].id;
    console.log(userId)

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
          return { psnAccountId: accountId, username: "Error Fetching", avatarUrl: null };
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

    res.json({ message: "Friends fetched and saved!", friends: savedFriendsResult.rows });
  } catch (error) {
    console.error("Error in getPSNUserFriends:", error);
    res.status(500).json({ error: "An error occurred while fetching user friends.", details: error.message });
  }
};

export const getPSNUserGames = async (req, res) => {
  // const psn = req.body.psn;
  const psn = 'The_Real_Zanatos';
  const NPSSO = process.env.NPSSO;

  if (!NPSSO) {
    return res.status(500).json({ error: "NPSSO token is missing in environment variables." });
  }

  try {
    const accessCode = await exchangeNpssoForCode(NPSSO);
    const authorization = await exchangeCodeForAccessToken(accessCode);

    const allAccountsSearchResults = await makeUniversalSearch(
      authorization,
      psn,
      "SocialAllAccounts"
    );

    if (
      !allAccountsSearchResults.domainResponses ||
      !allAccountsSearchResults.domainResponses.length ||
      !allAccountsSearchResults.domainResponses[0].results ||
      !allAccountsSearchResults.domainResponses[0].results.length
    ) {
      return res.status(404).json({ error: "User not found or no PSN account linked." });
    }

    const targetAccountId = allAccountsSearchResults.domainResponses[0].results[0].socialMetadata.accountId;
    const { trophyTitles } = await getUserTitles(authorization, targetAccountId, { limit: 800 });

    const userPS5Games = trophyTitles.filter(game => game.trophyTitlePlatform?.toUpperCase() === "PS5" && !game.hiddenFlag);
    const gamesWithTrophies = await Promise.all(userPS5Games.map(async (game) => {
      try {
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

        return {
          gameId: game.npCommunicationId,
          name: game.trophyTitleName,
          image: game.trophyTitleIconUrl,
          progress: game.progress,
          earnedTrophies: game.earnedTrophies,
          trophies
        };
      } catch (err) {
        console.error(`Failed to fetch trophies for ${game.trophyTitleName}:`, err);
        return {
          gameId: game.npCommunicationId,
          name: game.trophyTitleName,
          image: game.trophyTitleIconUrl,
          progress: game.progress,
          earnedTrophies: game.earnedTrophies,
          error: err.message
        };
      }
    }));

    res.json(gamesWithTrophies);
  } catch (error) {
    console.error("Error in getPSNUserGamesAndTrophies:", error);
    res.status(500).json({ error: "An error occurred while fetching user games and trophies.", details: error.message });
  }
};

export const psnController = {
  getPSNUserData,
  getPSNUserFriends,
  getPSNUserGames,
}