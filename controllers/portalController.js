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
      psn: user.psn,
      role: user.role || 2001,
      verified: user.verified,
      psnAvatar: user.psnAvatar,
      psnPlus: user.psnPlus,
      accountLevel: user.accountLevel,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '10s',
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '7d',
    });

    return res.status(201).json({
      user: payload,
      token: accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Error Handling User Login:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

export const refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token missing' });
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const newToken = jwt.sign(
      { 
        id: payload.id, 
        email: payload.email, 
        psn: payload.psn,
        role: payload.role,
        verified: payload.verified,
        psnAvatar: payload.psnAvatar,
        psnPlus: payload.psnPlus,
        accountLevel: payload.accountLevel,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({ token: newToken });
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};

export const portalController = {
  loginUser,
  refreshToken,
}