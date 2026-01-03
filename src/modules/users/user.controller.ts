import { Body, Controller, Inject, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserRegister } from "./dto/userRegister.dto";
import { UserLogin } from "./dto/userLogin.dto";
import { Public } from "src/common/decord/Public.decorator";

@Controller("users")
export class UserController {
  @Inject()
  private readonly userService: UserService;

  @Post("register")
  @Public()
  async registerUser(@Body() userRegister: UserRegister) {
    return await this.userService.registerUser(userRegister);
  }

  @Post('login')
  @Public()
  async loginUser(@Body() userLogin: UserLogin) {
    return await this.userService.loginUser(userLogin);
  }
}
