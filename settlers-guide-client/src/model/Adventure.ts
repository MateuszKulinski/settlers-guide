import AdventureCategory from "./AdventureCategory";

export default class Adventure {
    constructor(
        public id: string,
        public name: string,
        public adventuresCategory: AdventureCategory
    ) {}
}
