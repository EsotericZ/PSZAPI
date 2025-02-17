import query from '../db/index.js';
import {
  getPSNUserData,
  getPSNUserFriends,
  getPSNUserGames,
} from '../service/psnService.js';

export const updateUserPSN = async (req, res) => {
  const userId = req.params.id;
  const NPSSO = process.env.NPSSO;

  if (!NPSSO) {
    return res.status(500).json({ error: 'NPSSO Token is Missing' });
  }

  try {
    const userCheckQuery = `
      SELECT 
        psn, 
        "accountLevel", 
        "lastApiRequestStandard", 
        "lastApiRequestPremium"
      FROM users 
      WHERE id = $1
    `;
    const userResult = await query(userCheckQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User Not Found' });
    }

    const { psn: userPsn, accountLevel, lastApiRequestStandard, lastApiRequestPremium } = userResult.rows[0];

    const now = new Date();
    let lastRequestTime = accountLevel === "premium" ? lastApiRequestPremium : lastApiRequestStandard;
    lastRequestTime = lastRequestTime ? new Date(lastRequestTime) : new Date(0); 
    let cooldown = accountLevel === "premium" ? 60 * 1000 : 24 * 60 * 60 * 1000;

    if (lastRequestTime && now - new Date(lastRequestTime) < cooldown) {
      const timeRemaining = cooldown - (now - lastRequestTime);
      return res.status(200).json({ 
        success: false, 
        message: 'Cooldown Period Has Not Elapsed.',
        timeRemaining
      });
    }
    
    const [userData, userFriends, userGames] = await Promise.all([
      getPSNUserData(userId, userPsn, NPSSO),
      getPSNUserFriends(userId, userPsn, NPSSO),
      getPSNUserGames(userId, userPsn, NPSSO),
    ]);

    const updateTimestampQuery = `
      UPDATE users 
      SET ${accountLevel === "premium" ? `"lastApiRequestPremium"` : `"lastApiRequestStandard"`} = $2
      WHERE id = $1
    `;
    await query(updateTimestampQuery, [userId, now]);

    res.json({
      message: 'User PSN data updated successfully!',
      userData,
      userFriends,
      userGames,
    });
  } catch (error) {
    console.error('Error in updateUserPSN:', error);
    res.status(500).json({ error: 'An error occurred while updating user PSN data.', details: error.message });
  }
}

export const psnController = {
  updateUserPSN,
}