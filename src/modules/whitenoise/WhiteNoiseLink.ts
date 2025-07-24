import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { WhiteNoiseEntity } from "./WhiteNoise";

@Entity({ name: "whitenoiselinks" })
export class WhiteNoiseLinkEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  url: string;
  @Column()
  fileName: string;
  @ManyToOne(() => WhiteNoiseEntity, (whiteNoise) => whiteNoise.linkToAudios)
  @JoinColumn({ name: "whiteNoiseId" })
  whiteNoise: WhiteNoiseEntity;
}
