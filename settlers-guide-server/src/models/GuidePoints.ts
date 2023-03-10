import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Auditable } from "./Auditable";
import { Guide } from "./Guide";
import { User } from "./User";

@Entity({ name: "GuidePoints" })
export class GuidePoints extends Auditable {
    @PrimaryGeneratedColumn({
        name: "Id",
        type: "bigint",
    })
    id: string;

    @Column("boolean", {
        default: false,
        nullable: false,
        name: "Increment",
    })
    increment: boolean;

    @ManyToOne(() => User, (user) => user.guidePoints, {
        onDelete: "CASCADE",
    })
    user: User;

    @ManyToOne(() => Guide, (guide) => guide.guidePoints)
    guide: Guide;
}
