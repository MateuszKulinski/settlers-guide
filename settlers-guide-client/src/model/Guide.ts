import Adventure from "./Adventure";
import User from "./User";

export class Guide {
    constructor(
        public name: string,
        public adventure: Adventure,
        public type: number,
        public description: string,
        public id?: string,
        public lastModifiedOn?: string,
        public user?: User
    ) {}
}
