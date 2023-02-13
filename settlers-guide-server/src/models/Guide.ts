import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Auditable } from "./Auditable";
import { General } from "./General";
import { GuideAttack } from "./GuideAttack";
import { GuidePoints } from "./GuidePoints";
import { User } from "./User";

@Entity({ name: "Guide" })
export class Guide extends Auditable {
    @PrimaryGeneratedColumn({
        name: "Id",
        type: "bigint",
    })
    id: string;

    @Column("varchar", {
        name: "Name",
        length: 100,
        nullable: false,
    })
    name: string;

    @Column("text", {
        name: "Description",
        nullable: true,
    })
    description: string;

    @Column("smallint", {
        name: "Type",
        nullable: false,
        comment: "1 - private, 2 - for friends, 3 - public",
    })
    type: number;

    @ManyToOne(() => User, (user) => user.guides)
    user: User;

    @ManyToMany(() => General)
    @JoinTable({
        name: "GuideGenerals",
    })
    generals: General[];

    @OneToMany(() => GuidePoints, (guidePoints) => guidePoints.guide)
    guidePoints: GuidePoints[];

    @OneToMany(() => GuideAttack, (guideAttack) => guideAttack.guide)
    attacks: GuideAttack;
}
