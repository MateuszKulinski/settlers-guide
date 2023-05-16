import GuideAttackUnit from "./GuideAttackUnit";

export default class Wave {
    constructor(
        public waveId: string,
        public items: GuideAttackUnit[],
        public generalId?: string
    ) {}
}
