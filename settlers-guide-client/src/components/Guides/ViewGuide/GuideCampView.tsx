import React, { FC, useEffect, useState } from "react";
import GuideCamp from "../../../model/GuideCamp";

interface GuideCampViewProp {
    attack: GuideCamp;
}

const GuideCampView: FC<GuideCampViewProp> = ({ attack }) => {
    const [guideArmy, setGuideArmy] = useState();

    useEffect(() => {
        const guideArmyJson = JSON.parse(attack.army);
        const guideOpponentsJson = JSON.parse(attack.opponents);
    }, []);
    console.log(attack);
    return <div>TEST</div>;
};

export default GuideCampView;
