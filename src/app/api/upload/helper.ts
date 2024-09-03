import { cloudinary } from './config'; // adjust the path as needed
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

type UploadResponse = 
  { success: true; result?: UploadApiResponse } | 
  { success: false; error: UploadApiErrorResponse };

const uploadToCloudinary = (
  fileUri: string, fileName: string): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(fileUri, {
      invalidate: true,
      resource_type: 'auto',
      filename_override: fileName,
      folder: 'product-images', // adjust folder name as needed
      use_filename: true,
    })
    .then(result => resolve({ success: true, result }))
    .catch(error => reject({ success: false, error }));
  });
};

export { uploadToCloudinary };
