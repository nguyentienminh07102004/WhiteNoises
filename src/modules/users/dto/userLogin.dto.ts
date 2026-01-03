import { IsEmail, IsNotEmpty, Min } from "class-validator";

export class UserLogin {
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @Min(8)
    password: string;
}