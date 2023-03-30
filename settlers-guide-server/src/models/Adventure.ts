import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { AdventureCategory } from "./AdventureCategory";
import { Guide } from "./Guide";

@Entity({ name: "Adventure" })
export class Adventure extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: "Id",
        type: "bigint",
    })
    id: string;

    @Column("varchar", {
        name: "Name",
        length: 50,
        nullable: false,
    })
    name: string;

    @ManyToOne(
        () => AdventureCategory,
        (adventureCategory) => adventureCategory.adventures
    )
    adventuresCategory: AdventureCategory;

    @OneToMany(() => Guide, (guide) => guide.adventure)
    guides: Guide;
}
