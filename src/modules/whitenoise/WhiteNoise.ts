import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { WhiteNoiseLinkEntity } from "./WhiteNoiseLink";

@Entity({ name: "whitenoises" })
export class WhiteNoiseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  titleName: string;
  @Column()
  subTitle: string;
  @Column()
  description: string;
  @Column()
  linkBackgroundImage: string;
  @OneToMany(() => WhiteNoiseLinkEntity, (whiteNoiseLink) => whiteNoiseLink.whiteNoise, {
    cascade: ['insert', 'update', 'remove', 'soft-remove', 'recover']
  })
  linkToAudios: WhiteNoiseLinkEntity[];
}
