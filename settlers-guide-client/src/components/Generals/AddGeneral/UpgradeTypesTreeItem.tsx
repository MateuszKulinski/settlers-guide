import React, { FC, useState } from "react";
import { _API_VERSION_, _SERVER_URL_ } from "../../../assets/consts";
import GeneralUpgradeType from "../../../model/GeneralUpgradeType";
import { GeneralUpgradeTypeItemInterface } from "./AddGeberal";

interface GeneralUpgradeTypeItemProps {
    generalUpgradeType: GeneralUpgradeType;
    sendOutUpgradeItem: (item: GeneralUpgradeTypeItemInterface) => void;
}

const GeneralUpgradeTypeItem: FC<GeneralUpgradeTypeItemProps> = ({
    generalUpgradeType,
    sendOutUpgradeItem,
}) => {
    const [level, setLevel] = useState<number>(0);

    const handleUpgradeClick = () => {
        const newLevel = level >= 3 ? 0 : level + 1;
        level >= 3 ? setLevel(0) : setLevel(newLevel);
        const newItem: GeneralUpgradeTypeItemInterface = {
            upgradeType: generalUpgradeType.id,
            level: newLevel,
        };
        sendOutUpgradeItem(newItem);
    };

    return (
        <div onClick={handleUpgradeClick}>
            <img
                src={`${_SERVER_URL_}/api/${_API_VERSION_}/img/GeneralUpgradeType/${generalUpgradeType.id}`}
                alt={`${generalUpgradeType.name}`}
            />
            <div className="levelUpgradeContainer">
                <span className="levelUpgrade">{level}</span>
                <span className="levelUpgradeMax">{3}</span>
            </div>
        </div>
    );
};
export default GeneralUpgradeTypeItem;
