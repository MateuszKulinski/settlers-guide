import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Adventure } from "./Adventure";

@Entity({ name: "AdventureCategory" })
export class AdventureCategory extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: "Id",
        type: "bigint",
    })
    id: string;

    @Column("varchar", {
        name: "Name",
        length: 50,
        nullable: false,
    })
    name: string;

    @OneToMany(() => Adventure, (adventure) => adventure.adventuresCategory)
    adventures: Adventure;
}
