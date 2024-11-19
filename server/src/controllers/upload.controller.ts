import { Request, Response } from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

// Configure S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const s3Url = (filename: string) => {
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${filename}`;
};

// Configure multer
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 4, // max 4 files per upload
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/^image\/(jpeg|png|gif)$/)) {
      cb(new Error('Only image files are allowed'));
      return;
    }
    cb(null, true);
  },
}).array('images', 4);

export const uploadImages = async (req: Request, res: Response) => {
  // Handle multer upload
  await new Promise((resolve, reject) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        reject(new Error(err.message));
      } else if (err) {
        reject(new Error('Error uploading files'));
      }
      resolve(true);
    });
  });

  if (!req.files || !Array.isArray(req.files)) {
    throw new Error('No files uploaded');
  }

  const uploadPromises = (req.files as Express.Multer.File[]).map(
    async (file) => {
      const fileExtension = file.mimetype.split('/')[1];
      const fileName = `${uuidv4()}.${fileExtension}`;

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `uploads/${fileName}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      });

      await s3Client.send(command);

      return s3Url(fileName);
    },
  );

  const uploadedUrls = await Promise.all(uploadPromises);

  return res.json({
    message: 'Files uploaded successfully',
    urls: uploadedUrls,
  });
};

// Delete image from S3
export const deleteImage = async (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url) {
    console.log('url is required');
    return res.status(400).json({ error: 'url is required' });
  }

  // Extract key from URL
  const key = url.split('.com/')[1];

  const command = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  };

  await s3Client.send(new PutObjectCommand(command));

  return res.json({ message: 'Image deleted successfully' });
};
