import { User } from '../models/index.js';
import { getSession } from '../services/googleService.js';

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const session = await getSession(token);
    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const user = await User.findByPk(session.userId, {
      attributes: ['id', 'name', 'email', 'picture']
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default authenticateToken