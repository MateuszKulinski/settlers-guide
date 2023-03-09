import GeneralUpgradeType from "./GeneralUpgradeType";

export default class GeneralUpgrade {
    constructor(
        public id: string,
        public name: string,
        public upgradeType: GeneralUpgradeType,
        public level: number
    ) {}
}
