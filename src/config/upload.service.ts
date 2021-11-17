import { HttpException, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

import { createTokenHEX } from '../utils';

@Injectable()
export class UploadService {
  private s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION
  });

  async uploadFile(file: Express.MulterS3.File) {
    if (!file.mimetype.includes('image')) throw new HttpException('Arquivo não suportado', 400);

    const hash = createTokenHEX();

    if (process.env.NODE_ENV === 'dev') return { url: `http://localhost:8000/files/${file.filename}` };

    const upload = await this.s3.upload({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${hash}__${file.originalname}`,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype
    }).promise();

    return { url: upload.Location };
  }
}