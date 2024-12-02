import query from '../db/index.js';

export const getAllUsers = async (req, res) => {
  try {
    const statement = `
      SELECT *
      FROM users
    `;
    const result = await query(statement);

    res.status(200).send(result.rows);
  } catch (error) {
    console.error('Error getting Users', error);
    res.status(500).send({ error: 'Unable To Retrieve Users Requested' });
  }
}

export const userController = {
  getAllUsers,
}