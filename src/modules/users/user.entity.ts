import { Role } from "src/common/roles/role.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  fullName: string;
  @Column()
  dateOfBirth: Date;
  @Column({ nullable: false, unique: true })
  email: string;
  @Column({ nullable: false })
  password: string;
  @Column({ default: "ACTIVE" })
  status: "ACTIVE" | "INACTIVE";
  @Column({ default: Role.USER, type: 'text' })
  role: Role;
}
