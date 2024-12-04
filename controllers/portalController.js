import query from '../db/index.js';

export const loginUser = async (req, res) => {
  const { email } = req.body;
  
  try {
    const checkUserQuery  = `
      SELECT *
      FROM users
      WHERE email = $1
    `;
    const { rows, rowCount } = await query(checkUserQuery , [email]);

    if (rowCount > 0) {
      return res.status(200).json(rows[0]);
    } else {
      const createUserQuery = `
        INSERT INTO users (email)
        VALUES ($1)
        RETURNING *
      `;
      const { rows: newRow } = await query(createUserQuery, [email]);

      return res.status(201).json(newRow[0]);
    }
  } catch (error) {
    console.error('Error Handling User Login:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

export const portalController = {
  loginUser,
}