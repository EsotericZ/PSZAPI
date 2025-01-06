import query from '../db/index.js';

export const getAllGames = async (req, res) => {
  try {
    const statement = `
      SELECT *
      FROM games
      ORDER BY name ASC
    `;
    const result = await query(statement);

    res.status(200).send(result.rows);
  } catch (error) {
    console.error('Error Getting Games', error);
    res.status(500).send({ error: 'Unable To Retrieve Games Requested' });
  }
}

export const gameController = {
  getAllGames,
}