import {
  exchangeCodeForAccessToken,
  exchangeNpssoForCode,
  getProfileFromAccountId,
  getProfileFromUserName,
  getUserFriendsAccountIds,
  getUserTitles,
  makeUniversalSearch,
} from "psn-api";

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
  // const psn = req.body.psn;
  const psn = 'The_Real_Zanatos';
  const NPSSO = process.env.NPSSO;

  if (!NPSSO) {
    return res.status(500).json({ error: "NPSSO token is missing in environment variables." });
  }

  try {
    const accessCode = await exchangeNpssoForCode(NPSSO);
    const authorization = await exchangeCodeForAccessToken(accessCode);
    const searchResults = await makeUniversalSearch(authorization, psn, "SocialAllAccounts");
    const foundAccountId = searchResults.domainResponses[0].results[0].socialMetadata.accountId;
    const userFriends = await getUserFriendsAccountIds(authorization, foundAccountId);

    const friendsData = await Promise.all(
      userFriends.friends.map(async (accountId) => {
        if (!accountId) {
          return { accountId: null, username: "Unknown", avatarUrl: null };
        }
    
        try {
          const profile = await getProfileFromAccountId(authorization, accountId);
          return {
            accountId,
            username: profile.onlineId,
            avatarUrl: profile.avatars?.[0]?.url || null,
          };
        } catch (profileError) {
          console.error(`Error fetching profile for ${accountId}:`, profileError.message);
          return { accountId, username: "Error Fetching", avatarUrl: null };
        }
      })
    );

    res.json(friendsData);
  } catch (error) {
    console.error("Error in getPSNUserFriends:", error);
    res.status(500).json({ error: "An error occurred while fetching user friends.", details: error.message });
  }
}

export const getPSNUserGames = async (req, res) => {
  // const psn = req.body.psn;
  const psn = 'The_Real_Zanatos'
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
        "SocialAllAccounts",
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

      const userPS5Games = trophyTitles.filter((game) => {
          return game.trophyTitlePlatform?.toUpperCase() === "PS5";
      });

      res.json(userPS5Games);
  } catch (error) {
      console.error("Error in getPSNUserGames:", error);
      res.status(500).json({ error: "An error occurred while fetching user games.", details: error.message });
  }
}

export const psnController = {
  getPSNUserData,
  getPSNUserFriends,
  getPSNUserGames,
}