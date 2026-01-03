import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { DataSource } from "typeorm";
import { UserLogin } from "./dto/userLogin.dto";
import { UserRegister } from "./dto/userRegister.dto";
import { UserEntity } from "./user.entity";

@Injectable()
export class UserService {
  @Inject()
  private readonly dataSource: DataSource;
  @Inject()
  private readonly jwtService: JwtService;

  async registerUser(userRegister: UserRegister) {
    return await this.dataSource.transaction(async (manager) => {
      const email = userRegister.email;
      const user = await manager.getRepository(UserEntity).findOneBy({ email: email });
      if (user) throw new BadRequestException();
      const dateOfBirth = new Date(userRegister.dateOfBirth);
      const newUser = manager.getRepository(UserEntity).create({
        email,
        dateOfBirth,
        fullName: userRegister.fullName,
        password: await bcrypt.hash(userRegister.password, await bcrypt.genSalt(12))
      });
      await manager.createQueryBuilder().insert().into(UserEntity).values(newUser).execute();
      return newUser;
    });
  }

  async loginUser(userLogin: UserLogin) {
    const user = await this.dataSource.getRepository(UserEntity).findOneBy({ email: userLogin.email });
    if (!user) throw new BadRequestException();
    const isValidPassword = await bcrypt.compare(userLogin.password, user.password);
    if (!isValidPassword) {
      throw new BadRequestException();
    }
    const payload = { sub: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload)
    };
  }

  async getUserByEmail(email: string) {
    const user = await this.dataSource.getRepository(UserEntity).findOneBy({ email: email });
    if (!user) throw new BadRequestException();
    return user;
  }
}
