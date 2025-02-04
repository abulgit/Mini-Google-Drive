// auth.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
// import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';

interface GooglePayload {
  email?: string;
  name?: string;
}

interface GoogleLoginRequest extends Request {
  body: {
    token: string;
  };
  user?: IUser;
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req: GoogleLoginRequest, res: Response) => {
  try {
    const { token } = req.body;
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload() as GooglePayload;
    if (!payload || !payload.email) {
      throw new Error('Invalid Google token');
    }

    let user = await User.findOne({ email: payload.email });
    
    if (!user) {
      user = new User({
        email: payload.email,
        username: payload.name || payload.email.split('@')[0],
        password: 'google-auth' 
      });
      await user.save();
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ 
      token: jwtToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Google login failed' });
    }
  }
};