export default class GuideAttackUnit {
    constructor(
        public unitId: string,
        public quantity: number,
        public looses: number,
        public typeId?: string
    ) {}
}
