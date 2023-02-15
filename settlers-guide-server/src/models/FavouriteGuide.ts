import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: "FavouriteGuide" })
export class FavouriteGuide extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: "Id",
        type: "bigint",
    })
    id: string;

    @ManyToOne(() => User, (user) => user.favouriteGuide)
    user: User;
}
