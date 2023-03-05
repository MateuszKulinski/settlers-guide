import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { GeneralType } from "./GeneralType";
import { GeneralUpgrade } from "./GeneralUpgrade";
import { User } from "./User";

@Entity({ name: "General" })
export class General extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: "Id",
        type: "bigint",
    })
    id: string;

    @Column("varchar", {
        name: "Name",
        length: 50,
        nullable: true,
    })
    name: string;

    @ManyToOne(() => GeneralType, (generalType) => generalType.general)
    generalType: GeneralType;

    @ManyToOne(() => User, (user) => user.generals)
    user: User;

    @OneToMany(() => GeneralUpgrade, (generalUpgrade) => generalUpgrade.general)
    upgrades: GeneralUpgrade[];
}
