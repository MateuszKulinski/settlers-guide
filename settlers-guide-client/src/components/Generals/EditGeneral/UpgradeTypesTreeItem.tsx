import React, { FC, useEffect, useState } from "react";
import {
    _API_VERSION_,
    _MAX_GENENERAL_ITEM_,
    _SERVER_URL_,
} from "../../../assets/consts";
import GeneralUpgradeType from "../../../model/GeneralUpgradeType";
import { GeneralUpgradeTypeItemInterface } from "./EditGeneral";

interface GeneralUpgradeTypeItemProps {
    generalUpgradeType: GeneralUpgradeType;
    sendOutUpgradeItem: (item: GeneralUpgradeTypeItemInterface) => void;
    startValue: number;
}

const GeneralUpgradeTypeItem: FC<GeneralUpgradeTypeItemProps> = ({
    generalUpgradeType,
    sendOutUpgradeItem,
    startValue,
}) => {
    const [level, setLevel] = useState<number>(startValue);

    const handleUpgradeClick = () => {
        const newLevel = level >= _MAX_GENENERAL_ITEM_ ? 0 : level + 1;
        level >= _MAX_GENENERAL_ITEM_ ? setLevel(0) : setLevel(newLevel);
        const newItem: GeneralUpgradeTypeItemInterface = {
            upgradeType: generalUpgradeType.id,
            level: newLevel,
        };
        sendOutUpgradeItem(newItem);
    };

    useEffect(() => {
        setLevel(startValue);
    }, []);

    return (
        <div
            onClick={handleUpgradeClick}
            className={`${level > 0 ? "boldItem" : "normalItem"}`}
        >
            <img
                src={`${_SERVER_URL_}/api/${_API_VERSION_}/img/GeneralUpgradeType/${generalUpgradeType.id}`}
                alt={`${generalUpgradeType.name}`}
            />
            <div className="levelUpgradeContainer">
                <span className="levelUpgrade">{level}</span>
                <span className="levelUpgradeMax">{_MAX_GENENERAL_ITEM_}</span>
            </div>
        </div>
    );
};
export default GeneralUpgradeTypeItem;
