import Adventure from "./Adventure";
import User from "./User";
import Image from "./Image";
import General from "./General";
import GuideCamp from "./GuideCamp";

export class Guide {
    constructor(
        public name: string,
        public adventure: Adventure,
        public type: number,
        public description: string,
        public id?: string,
        public lastModifiedOn?: string,
        public user?: User,
        public image?: Image,
        public generals?: [General],
        public attacks?: [GuideCamp]
    ) {}
}
