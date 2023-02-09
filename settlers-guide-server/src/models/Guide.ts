import {
    BaseEntity,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { General } from "./General";
import { User } from "./User";

@Entity({ name: "Guide" })
export class Guide extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: "Id",
        type: "bigint",
    })
    id!: string;

    @Column("varchar", {
        name: "Name",
        length: 100,
        nullable: false,
    })
    name!: string;

    @Column("text", {
        name: "description",
        nullable: true,
    })
    description: string;

    @Column("smallint", {
        name: "type",
        nullable: false,
    })
    type: number;

    @ManyToOne(() => User, (user) => user.guides)
    user!: User;

    @ManyToMany(() => General)
    @JoinTable({
        name: "GuideGenerals",
    })
    generals!: General[];
}
