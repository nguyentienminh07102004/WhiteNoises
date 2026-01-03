import { IsEmail, IsNotEmpty, Min } from "class-validator";

export class UserRegister {
    @IsNotEmpty()
    fullName: string;
    @IsNotEmpty()
    @Min(8)
    password: string;
    @IsEmail()
    email: string;
    dateOfBirth: string;
}