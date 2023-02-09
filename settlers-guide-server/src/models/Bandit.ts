import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "Bandit" })
export class Bandit extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: "Id",
        type: "bigint",
    })
    id!: string;

    @Column("varchar", {
        name: "Name",
        length: 50,
        nullable: false,
    })
    name!: string;
}
