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
      expiresIn: '15m',
    })

    return res.status(201).json({
      user: payload,
      token,
    });
  } catch (error) {
    console.error('Error Handling User Login:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

export const refreshToken = (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token missing' });
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const newToken = jwt.sign(
      { 
        id: payload.id, 
        email: payload.email, 
        role: payload.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return res.json({ token: newToken });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};

export const portalController = {
  loginUser,
  refreshToken,
}