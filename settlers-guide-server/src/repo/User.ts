import { Auditable } from "./Auditable";
import { Length } from "class-validator";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "User" })
export class User extends Auditable {
    @PrimaryGeneratedColumn({
        name: "Id",
        type: "bigint",
    })
    id!: string;

    @Column("varchar", {
        name: "Email",
        length: 100,
        unique: true,
        nullable: false,
    })
    email!: string;

    @Column("varchar", {
        name: "Password",
        length: 100,
        nullable: false,
    })
    @Length(8, 100)
    password!: string;
}
