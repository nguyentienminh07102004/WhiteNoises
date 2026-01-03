import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { WhiteNoiseEntity } from "../whitenoise/WhiteNoise.entity";

@Entity("tags")
export class TagEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  name: string;
  @Column({ unique: true, nullable: false })
  code: string;

  @OneToMany(() => WhiteNoiseEntity, whitenoise => whitenoise.tag, {
    cascade: ['update']
  })
  whitenoises: WhiteNoiseEntity[];
}
