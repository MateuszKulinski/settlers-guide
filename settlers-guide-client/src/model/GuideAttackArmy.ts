export default class GuideAttackArmy {
    constructor(
        public idBandit: string,
        public quantity: number,
        public looses: number,
        public isFail: boolean,
        public wave: number,
        public generalId: string
    ) {}
}
