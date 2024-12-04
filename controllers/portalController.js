import jwt from 'jsonwebtoken';
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

    let user;
    if (rowCount > 0) {
      user = rows[0];
    } else {
      const createUserQuery = `
        INSERT INTO users (email)
        VALUES ($1)
        RETURNING *
      `;
      const { rows: newRow } = await query(createUserQuery, [email]);
      user = newRow[0];
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role || 2001,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Error Handling User Login:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

export const portalController = {
  loginUser,
}