import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { General } from "./General";
import { GeneralUpgradeType } from "./GeneralUpgradeType";

@Entity({ name: "GeneralUpgrade" })
export class GeneralUpgrade extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: "Id",
        type: "bigint",
    })
    id!: string;

    @Column("smallint", {
        name: "level",
        nullable: false,
    })
    level!: number;

    @ManyToOne(
        () => GeneralUpgradeType,
        (generalUpgradeType) => generalUpgradeType.generalUpgades
    )
    upgrades: GeneralUpgradeType;

    @ManyToOne(() => General, (general) => general.upgrades)
    general: General;
}
