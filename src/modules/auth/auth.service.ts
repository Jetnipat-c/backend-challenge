import { BadRequestException, Injectable } from '@nestjs/common';
import { IFirebaseUser } from '../firebase/firebase.service';
import { InjectRepository } from '@nestjs/typeorm';
import { AliasRole, Users } from 'src/database';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
  ) {}
  async signin(user: IFirebaseUser) {
    try {
      const { email, uid, displayName, photoURL } = user;
      const userDB = await this.userRepo.findOne({ where: { refUid: uid } });
      if (!userDB) {
        const newUser = this.userRepo.create({
          refUid: uid,
          email,
          name: displayName,
          role: AliasRole.EMPLOYEE,
          photoUrl: photoURL,
        });
        return await this.userRepo.save(newUser);
      }
      if (
        userDB.name !== displayName ||
        (userDB.photoUrl !== photoURL && photoURL)
      ) {
        await this.userRepo.update(userDB.id, {
          refUid: uid,
          email,
          name: displayName,
          photoUrl: photoURL,
        });
      }
      return userDB;
    } catch (error) {
      throw new BadRequestException("Can't sync user");
    }
  }
}
