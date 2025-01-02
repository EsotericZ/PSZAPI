import jwt from 'jsonwebtoken';

const verifyRoles = (...allowedRoles) => (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization Header Missing' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' }); 
      }
      return res.status(403).json({ message: 'Invalid token' }); 
    }

    if (!allowedRoles.includes(decoded.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    req.user = decoded;
    next();
  });
}

export default verifyRoles;