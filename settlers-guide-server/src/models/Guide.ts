import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Auditable } from "./Auditable";
import { Adventure } from "./Adventure";
import { General } from "./General";
import { GuideAttack } from "./GuideAttack";
import { GuidePoints } from "./GuidePoints";
import { User } from "./User";
import { Image } from "./Image";

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

    @ManyToOne(() => User, (user) => user.guides, {
        onDelete: "CASCADE",
    })
    user: User;

    @ManyToMany(() => General)
    @JoinTable({
        name: "GuideGeneral",
        joinColumn: {
            name: "guideId",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "generalId",
            referencedColumnName: "id",
        },
    })
    generals: General[];

    @OneToMany(() => GuidePoints, (guidePoints) => guidePoints.guide)
    guidePoints: GuidePoints[];

    @OneToMany(() => GuideAttack, (guideAttack) => guideAttack.guide)
    attacks: GuideAttack[];

    @ManyToOne(() => Adventure, (adventure) => adventure.guides)
    adventure: Adventure;

    @OneToOne(() => Image, (image) => image.guide, {
        nullable: true,
    })
    image: Image;
}
