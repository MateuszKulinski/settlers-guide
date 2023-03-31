import { BaseEntity, Column } from "typeorm";

export class Auditable extends BaseEntity {
    @Column("timestamp", {
        name: "CreatedOn",
        default: () => `now()`,
        nullable: false,
    })
    createdOn: Date;

    @Column("timestamp", {
        name: "LastModifiedOn",
        default: () => `now()`,
        nullable: false,
    })
    lastModifiedOn: Date;
}
