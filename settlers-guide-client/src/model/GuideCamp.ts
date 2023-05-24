import GuideAttackArmy from "./GuideAttackArmy";
import GuideAttackOpponent from "./GuideAttackOpponent";

export default class GuideCamp {
    constructor(
        public guideId: string,
        public opponents: string,
        public army: string,
        public description: string,
        public camp: number,
        public garrison: number,
        public attackId?: string
    ) {}
}
