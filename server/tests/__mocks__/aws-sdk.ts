export const mockS3Instance = {
  send: jest
    .fn()
    .mockResolvedValue({
      Location: 'https://test-bucket.s3.amazonaws.com/test-image.jpg',
    }),
};

export const S3Client = jest.fn(() => mockS3Instance);

export const PutObjectCommand = jest.fn();
export const DeleteObjectCommand = jest.fn();
