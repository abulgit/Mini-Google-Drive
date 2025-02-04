// files.ts
import { Request, Response } from 'express';
import ImageKit from 'imagekit';
import File from '../models/File';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { IUser } from '../models/User';
import { AuthRequest } from '../middlewares/auth';
dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

interface FileUploadRequest extends Request {
  user?: IUser;
  userId?: string;
}

interface FileResponse {
  filename: string;
  actualFilename: string;
  fileId: string;
  url: string;
  size: number;
  createdAt: Date;
}

interface IFile {
  filename: string;
  actualFilename: string;
  fileId: string;
  url: string;
  size: number;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface FileRequestBody {
  actualFilename: string;
  fileId: string;
  url: string;
  size: string | number;
  filename: string;
}

export const getAuthParams = (req: AuthRequest, res: Response) => {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    res.json(authParams);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error generating auth parameters' });
    }
  }
};

export const saveFile = async (req: AuthRequest & { body: FileRequestBody }, res: Response) => {
  try {
    const { actualFilename, fileId, url, size, filename } = req.body;
    
    if (!req.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userObjectId = new mongoose.Types.ObjectId(req.userId);

    // Validate actual filename
    if (!actualFilename || typeof actualFilename !== 'string' || actualFilename.trim().length === 0) {
      return res.status(400).json({ message: 'Invalid filename' });
    }

    // Convert size to number and validate
    const fileSize = Number(size);
    if (isNaN(fileSize) || fileSize <= 0) {
      return res.status(400).json({ message: 'Invalid file size' });
    }

    // Check storage (100MB limit)
    const storageLimit = 100 * 1024 * 1024; // 100MB in bytes
    const storageStats = await File.aggregate([
      { $match: { user: userObjectId } },
      { $group: { 
          _id: null, 
          totalUsed: { $sum: "$size" } 
        } 
      }
    ]);

    const totalUsed = storageStats[0]?.totalUsed || 0;

    if (totalUsed + fileSize > storageLimit) {
      return res.status(400).json({
        message: `Storage limit exceeded. You have ${(storageLimit - totalUsed)/1024/1024}MB remaining`
      });
    }

    // Save file with numeric size
    const newFile = new File({
      filename,
      actualFilename,
      fileId,
      url,
      size: fileSize,
      user: req.userId,
    });

    await newFile.save();
    res.status(201).json({
      filename: newFile.filename,
      actualFilename: newFile.actualFilename,
      fileId: newFile.fileId,
      url: newFile.url,
      size: newFile.size,
      createdAt: newFile.createdAt
    });

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const getFiles = async (req: FileUploadRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const files = await File.find({ user: req.userId })
      .select('filename actualFilename fileId url size createdAt');
    res.json(files);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const deleteFile = async (req: AuthRequest & { params: { id: string } }, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if file exists and belongs to the current user
    const file = await File.findOne({ 
      _id: id,
      user: req.userId 
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete from ImageKit
    try {
      await imagekit.deleteFile(file.fileId);
    } catch (imagekitError) {
      console.error('ImageKit deletion error:', imagekitError);
      // Continue with database deletion even if ImageKit fails
      // The file might have already been deleted from ImageKit
    }

    // Delete from database
    await file.deleteOne();

    res.status(200).json({ 
      message: 'File deleted successfully',
      deletedFile: {
        filename: file.filename,
        actualFilename: file.actualFilename,
        fileId: file.fileId,
        size: file.size,
        // ... other fields
      }
    });

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// Add proper type for storage stats
interface StorageStats {
  storageLimit: number;
  totalUsed: number;
  remainingSpace: number;
  percentageUsed: string;
  fileCount: number;
  recentFiles: Array<{
    actualFilename: string;
    size: number;
  }>;
}

export const getStorageStats = async (req: FileUploadRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const userObjectId = new mongoose.Types.ObjectId(req.userId);

    const result = await File.aggregate([
      { 
        $match: { user: userObjectId }
      },
      { 
        $group: { 
          _id: null, 
          totalUsed: { $sum: "$size" },
          fileCount: { $sum: 1 }
        } 
      }
    ]);

    const storageLimit = 100 * 1024 * 1024; // 100MB
    const totalUsed = result[0]?.totalUsed || 0;
    const percentageUsed = (totalUsed / storageLimit * 100).toFixed(2);

    const recentFiles = await File.find({ user: userObjectId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('actualFilename size');

    const stats: StorageStats = {
      storageLimit,
      totalUsed,
      remainingSpace: storageLimit - totalUsed,
      percentageUsed: `${percentageUsed}%`,
      fileCount: result[0]?.fileCount || 0,
      recentFiles: recentFiles.map(file => ({
        actualFilename: file.actualFilename,
        size: file.size
      }))
    };

    res.json(stats);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

