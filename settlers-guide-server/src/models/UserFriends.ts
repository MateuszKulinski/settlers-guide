import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "UserFriends" })
export class UserFriends extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: "Id",
        type: "bigint",
    })
    id: string;

    @Column("bigint", {
        name: "UserIdFirst",
        nullable: false,
    })
    userIdFirst: string;

    @Column("bigint", {
        name: "UserIdSecond",
        nullable: false,
    })
    userIdSecond: string;

    @Column("boolean", {
        name: "Status",
        nullable: false,
    })
    status: boolean;
}
