import Adventure from "./Adventure";
import AdventureCategory from "./AdventureCategory";

export class Guide {
    constructor(
        public name: string,
        public adventureId: number,
        public type: number,
        public description: string,
        public id?: string
    ) {}
}
