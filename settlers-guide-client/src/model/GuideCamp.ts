import GuideAttackArmy from "./GuideAttackArmy";
import GuideAttackOpponent from "./GuideAttackOpponent";

export default class GuideAttack {
    constructor(
        public guideId: string,
        public opponents: GuideAttackOpponent[],
        public attacks: GuideAttackArmy[],
        public description: string,
        public campId?: string
    ) {}
}
