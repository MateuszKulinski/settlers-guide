import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Guide } from "./Guide";
import { GuideAttack } from "./GuideAttack";

@Entity({ name: "Image" })
export class Image extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: "Id",
        type: "bigint",
    })
    id: string;

    @Column("varchar", {
        name: "fileName",
    })
    fileName: string;

    @OneToOne(() => Guide, (guide) => guide.image, {
        nullable: true,
    })
    @JoinColumn({ name: "guideId" })
    guide: Guide;

    @ManyToOne(() => GuideAttack, (guideAttack) => guideAttack.image, {
        nullable: true,
    })
    guideAttack: GuideAttack;
}
