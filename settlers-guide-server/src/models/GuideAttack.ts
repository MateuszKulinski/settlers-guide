import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Guide } from "./Guide";

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

    @ManyToOne(() => Guide, (guide) => guide.attacks)
    guide: Guide;
}
