import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Guide } from "./Guide";
import { Image } from "./Image";

@Entity({ name: "GuideAttack" })
export class GuideAttack extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: "Id",
        type: "bigint",
    })
    id: string;

    @Column({
        name: "OpponentsJson",
        type: "text",
    })
    opponents: string;

    @Column({
        name: "ArmyJson",
        type: "text",
    })
    army: string;

    @Column({
        name: "Camp",
        type: "int",
    })
    camp: number;

    @Column({
        name: "Garrison",
        type: "int",
    })
    garrison: number;

    @Column({
        name: "Description",
        type: "text",
    })
    description: string;

    @ManyToOne(() => Guide, (guide) => guide.attacks)
    guide: Guide;

    @OneToMany(() => Image, (image) => image.guideAttack)
    image: Image;
}
