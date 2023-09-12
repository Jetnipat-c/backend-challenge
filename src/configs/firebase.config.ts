import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

const configService = new ConfigService();

export const firebaseConfig = () => {
  admin.initializeApp({
    credential: admin.credential.cert({
      private_key: configService.get<string>('FIREBASE_PRIVATE_KEY'),
      client_email: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
      project_id: configService.get<string>('FIREBASE_PROJECT_ID'),
    } as Partial<admin.ServiceAccount>),
  });
};
