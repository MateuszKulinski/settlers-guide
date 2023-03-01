import Adventure from "./Adventure";

export default class AdventureCategory {
    constructor(
        public id: string,
        public name: string,
        public adventures: Adventure[] = []
    ) {}
}
