import query from '../db/index.js';

export const getAllUserFriends = async (req, res) => {
  const userId = req.params.id;

  try {
    const statement = `
      SELECT 
        F.*, 
        U.id AS "pszUserId"
      FROM friends F
      LEFT JOIN users U 
      ON F."username" = U."psn"
      WHERE F."userId" = $1
      ORDER BY 
        U.id IS NULL,
        F."username" ASC
    `;
    const result = await query(statement, [userId]);

    res.status(200).send(result.rows);
  } catch (error) {
    console.error('Error Getting User Friends', error);
    res.status(500).send({ error: 'Unable To Retrieve User Friends' });
  }
}

export const friendController = {
  getAllUserFriends,
}