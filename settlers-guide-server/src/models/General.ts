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

    @Column("boolean", {
        name: "Public",
        default: false,
    })
    public: boolean;

    @ManyToOne(() => GeneralType, (generalType) => generalType.general)
    generalType: GeneralType;

    @ManyToOne(() => User, (user) => user.generals, {
        onDelete: "CASCADE",
    })
    user: User;

    @OneToMany(
        () => GeneralUpgrade,
        (generalUpgrade) => generalUpgrade.general,
        { cascade: true }
    )
    upgrades: GeneralUpgrade[];
}
