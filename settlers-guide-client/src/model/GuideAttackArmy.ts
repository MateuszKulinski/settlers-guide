import GuideAttackUnit from "./GuideAttackUnit";

export default class GuideAttackArmy {
    constructor(
        public attackId: string,
        public isFail: boolean,
        public wave: number,
        public generalId: string,
        public units: GuideAttackUnit[]
    ) {}
}
