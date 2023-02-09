import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { GeneralUpgrade } from "./GeneralUpgrade";

@Entity({ name: "GeneralUpgradeType" })
export class GeneralUpgradeType extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: "Id",
        type: "bigint",
    })
    id!: string;

    @Column("varchar", {
        name: "name",
        length: 30,
        nullable: false,
    })
    name!: string;

    @OneToMany(
        () => GeneralUpgrade,
        (generalUpgrade) => generalUpgrade.upgrades
    )
    generalUpgades: GeneralUpgrade;
}
