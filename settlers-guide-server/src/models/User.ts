import { Auditable } from "../models/Auditable";
import { Length } from "class-validator";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { General } from "./General";
import { Guide } from "./Guide";
import { GuidePoints } from "./GuidePoints";

@Entity({ name: "User" })
export class User extends Auditable {
    @PrimaryGeneratedColumn({
        name: "Id",
        type: "bigint",
    })
    id: string;

    @Column("varchar", {
        name: "Email",
        length: 100,
        unique: true,
        nullable: false,
    })
    email: string;

    @Column("varchar", {
        name: "Password",
        length: 100,
        nullable: false,
    })
    @Length(8, 100)
    password: string;

    @OneToMany(() => General, (general) => general.user)
    generals: General;

    @OneToMany(() => Guide, (guide) => guide.user)
    guides: Guide;

    @OneToMany(() => GuidePoints, (guidePoints) => guidePoints.user)
    guidePoints: GuidePoints[];
}
