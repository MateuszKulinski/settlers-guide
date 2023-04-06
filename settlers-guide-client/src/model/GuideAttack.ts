import GuideAttackArmy from "./GuideAttackArmy";
import GuideAttackOpponent from "./GuideAttackOpponent";

export default class GuideAttack {
    constructor(
        public guideId: string,
        public opponents: GuideAttackOpponent[],
        public army: GuideAttackArmy[],
        public description: string,
        public camp: number,
        public attackId?: string
    ) {}
}
