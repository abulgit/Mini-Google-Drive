// auth.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
// import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// export const register = async (req: Request, res: Response) => {
//   try {
//     const { email, password, username } = req.body;
    
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const user = new User({ email, password, username });
//     await user.save();
    
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
//       expiresIn: '1d',
//     });

//     res.status(201).json({ token });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const login = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
    
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
//       expiresIn: '1d',
//     });

//     res.json({ 
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//       }, 
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) throw new Error('Invalid Google token');

    let user = await User.findOne({ email: payload.email });
    
    if (!user) {
      user = new User({
        email: payload.email,
        //@ts-ignore
        username: payload.name || payload.email.split('@')[0],
        password: 'google-auth' // Dummy password
      });
      await user.save();
    }

    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
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
    res.status(500).json({ message: 'Google login failed' });
  }
};