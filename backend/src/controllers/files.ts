// files.ts
import { Request, Response } from 'express';
import ImageKit from 'imagekit';
import File from '../models/File';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});


export const getAuthParams = (req: Request, res: Response) => {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    res.json(authParams);
  } catch (error) {
    res.status(500).json({ message: 'Error generating auth parameters' });
  }
};

export const saveFile = async (req: Request, res: Response) => {
  try {
    const { actualFilename, fileId, url, size, filename } = req.body;
    
    // Validate actual filename
    if (!actualFilename || typeof actualFilename !== 'string' || actualFilename.trim().length === 0) {
      return res.status(400).json({ message: 'Invalid filename' });
    }

    // @ts-ignore
    const userId = req.userId;
    const userObjectId = new mongoose.Types.ObjectId(userId);

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
      user: userId,
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
    res.status(500).json({ message: 'Error saving file' });
  }
};

export const getFiles = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const files = await File.find({ user: req.userId })
      .select('filename actualFilename fileId url size createdAt');
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching files' });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if file exists and belongs to the current user
    const file = await File.findOne({ 
      _id: id,
      // @ts-ignore
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
    console.error('Error deleting file:', error);
    res.status(500).json({ 
      message: 'Failed to delete file', 
      //@ts-ignore
      error: error.message 
    });
  }
};

export const getStorageStats = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    
    // Convert string ID to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Update aggregation pipeline
    const result = await File.aggregate([
      { 
        $match: { 
          user: userObjectId // Use ObjectId here
        } 
      },
      { $group: { 
          _id: null, 
          totalUsed: { $sum: "$size" },
          fileCount: { $sum: 1 }
        } 
      }
    ]);

    const storageLimit = 100 * 1024 * 1024; // 100MB
    const totalUsed = result[0]?.totalUsed || 0;
    const percentageUsed = (totalUsed / storageLimit * 100).toFixed(2);

    // Get sample of recent filenames
    const recentFiles = await File.find({ user: userObjectId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('actualFilename size');

    res.json({
      storageLimit,
      totalUsed,
      remainingSpace: storageLimit - totalUsed,
      percentageUsed: `${percentageUsed}%`,
      fileCount: result[0]?.fileCount || 0,
      recentFiles: recentFiles.map(file => ({
        actualFilename: file.actualFilename,
        size: file.size
      }))
    });

  } catch (error) {
    console.error('Error getting storage stats:', error);
    res.status(500).json({ 
      message: 'Error getting storage stats',
      // @ts-ignore
      error: error.message 
    });
  }
};

