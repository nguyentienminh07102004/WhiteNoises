import { IsNotEmpty, IsUUID } from "class-validator";

export class TagUpdateDto {
    @IsUUID()
    id: string;
    @IsNotEmpty()
    name: string;
}