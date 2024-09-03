import { cloudinary } from './config';
import { NextRequest, NextResponse } from 'next/server';

const uploadToCloudinary = async (fileBuffer: Buffer, fileName: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        public_id: fileName,
        folder: 'product-images',
      },
      (error, result) => {
        if (error) {
          reject({ success: false, error });
        } else {
          resolve({ success: true, result });
        }
      }
    ).end(fileBuffer);
  });
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name;

    const result = await uploadToCloudinary(fileBuffer, fileName);

    if (result.success) {
      return NextResponse.json({ message: 'success', imgUrl: result.result.secure_url });
    } else {
      return NextResponse.json({ message: 'failure' });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
