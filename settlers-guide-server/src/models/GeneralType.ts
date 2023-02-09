import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { General } from "./General";

@Entity({ name: "GeneralType" })
export class GeneralType extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: "Id",
        type: "bigint",
    })
    id!: string;

    @Column("varchar", {
        name: "Name",
        length: 30,
        nullable: false,
    })
    name!: string;

    @OneToMany(() => General, (general) => general.generalType)
    general!: General;
}
