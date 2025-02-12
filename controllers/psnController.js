import {
  exchangeCodeForAccessToken,
  exchangeNpssoForCode,
  getProfileFromUserName,
  getUserFriendsAccountIds,
  getUserTitles,
  makeUniversalSearch,
} from "psn-api";

export const getPSNUserGames = async (req, res) => {
  try {
      // const psn = req.body.psn;
      const psn = 'Esoteric-Z'
      console.log(psn)

      const NPSSO = process.env.NPSSO;
      if (!NPSSO) {
          return res.status(500).json({ error: "NPSSO token is missing in environment variables." });
      }

      console.log(NPSSO)
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
      console.log("Fetching titles for Account ID:", targetAccountId);

      const userTitlesResponse = await getUserTitles(authorization, targetAccountId, { limit: 10 });

      console.log("📢 Full getUserTitles Response:", JSON.stringify(userTitlesResponse, null, 2));
      

      // const { trophyTitles } = await getUserTitles(authorization, targetAccountId, { limit: 800 });
      // const trophyTitles = await getUserTitles(authorization, targetAccountId, { limit: 800 });
      // console.log(trophyTitles)

      // const userPS5Games = trophyTitles.filter((game) => {
      //     return game.trophyTitlePlatform?.toUpperCase() === "PS5";
      // });

      // res.json(userPS5Games);
  } catch (error) {
      console.error("Error in getPSNUserGames:", error);
      res.status(500).json({ error: "An error occurred while fetching user games.", details: error.message });
  }
};

export const psnController = {
  getPSNUserGames,
}