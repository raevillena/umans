import { OAuth2Client } from 'google-auth-library';
import { GoogleUser } from '../models/index.js';
import client from '../config/google.js';
import { createSession, deleteSession } from '../services/googleService.js';


export const url = (req, res) => {
    const url = client.generateAuthUrl({
        access_type: 'offline',
        scope: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email'
        ]
      });
      res.json({ url });
}

export const callback = async (req, res) => {
    try {
        const { code } = req.query;
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);
    
        // Get user info from Google
        const oauth2Client = new OAuth2Client();
        oauth2Client.setCredentials(tokens);
        const url = 'https://www.googleapis.com/oauth2/v2/userinfo';
        const response = await oauth2Client.request({ url });
        const userInfo = response.data;

    
        // Return token to client
        res.status(200).json({ userInfo});
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

export const regislog = async (req, res) => {
  try {
    const { userInfo } = req.body;

    // Find or create user
    const [user] = await GoogleUser.findOrCreate({
      where: { googleId: userInfo.id },
      defaults: {
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture
      }
    });

    // Create session in Redis
    const token = await createSession(user.id);

    // Return token to client
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        await deleteSession(token);
        res.json({ message: 'Logged out successfully' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

export const me = (req, res) => {
    res.json(req.user);
}