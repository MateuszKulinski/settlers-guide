import GeneralType from "./GeneralType";
import GeneralUpgrade from "./GeneralUpgrade";

export default class General {
    constructor(
        public id: string,
        public name: string,
        public generalType: GeneralType,
        public upgrades: GeneralUpgrade
    ) {}
}
