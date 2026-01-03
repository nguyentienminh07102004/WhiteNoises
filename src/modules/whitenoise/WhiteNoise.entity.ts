import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { WhiteNoiseLinkEntity } from "./WhiteNoiseLink.entity";
import { TagEntity } from "../tags/tag.entity";

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

  @ManyToOne(() => TagEntity, tag => tag.whitenoises)
  @JoinColumn({name: 'tagCode', referencedColumnName: 'code'})
  tag: TagEntity;
}
