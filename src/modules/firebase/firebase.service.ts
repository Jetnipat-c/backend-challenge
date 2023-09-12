import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserInfo } from 'firebase-admin/lib/auth/user-record';
import { AliasRole } from 'src/database';
import * as admin from 'firebase-admin';

export interface IFirebaseUser extends Partial<UserInfo> {
  role: AliasRole;
  token: string;
}

@Injectable()
export class FirebaseService {
  private getToken(authToken: string): string {
    const match = authToken.match(/^Bearer (.*)$/);
    if (!match || match.length < 2) {
      throw new UnauthorizedException('INVALID_BEARER_TOKEN');
    }
    return match[1];
  }

  public async authenticate(authToken: string): Promise<IFirebaseUser> {
    const tokenString = this.getToken(authToken);
    try {
      const decodedToken: admin.auth.DecodedIdToken = await admin
        .auth()
        .verifyIdToken(tokenString);
      //   this.logger.info(`${JSON.stringify(decodedToken)}`);
      const { email, uid, name, picture } = decodedToken;

      const firebaseUser: IFirebaseUser = {
        email,
        uid,
        role: AliasRole.EMPLOYEE,
        displayName: name,
        token: authToken,
        photoURL: picture,
      };

      return firebaseUser;
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
