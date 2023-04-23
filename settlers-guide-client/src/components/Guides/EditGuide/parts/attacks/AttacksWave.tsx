import React, { FC } from "react";
import UnitBandit from "../../../../../model/UnitBandit";
import GuideAttackUnit from "../../../../../model/GuideAttackUnit";
import AttackUnits from "./AttackUnits";
import { faMinusSquare, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { generateUniqueId } from "./AttackCampEditor";
import { Button } from "react-bootstrap";

interface AttackWaveProp {
    waveId: string;
    types: UnitBandit[];
    isBandits: boolean;
    saveAttack: (data: GuideAttackUnit, waveId: string) => void;
    removeWave: (waveId: string) => void;
    addUnit: (waveId: string, data: GuideAttackUnit) => void;
    removeUnit: (waveId: string, unitId: string) => void;
    items?: GuideAttackUnit[];
}

const AttackWave: FC<AttackWaveProp> = ({
    waveId,
    types,
    isBandits,
    saveAttack,
    removeWave,
    addUnit,
    removeUnit,
    items = [],
}) => {
    const handleRemoveWave = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        removeWave(waveId);
    };
    const sendWave = (data: GuideAttackUnit) => {
        saveAttack(data, waveId);
    };

    const handleAddItems = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        const newItem = new GuideAttackUnit(generateUniqueId(), 0, 0);
        addUnit(waveId, newItem);
    };

    const removeUnitItem = (unitId: string) => {
        removeUnit(waveId, unitId);
    };

    return (
        <div className="campContainer">
            {isBandits ? "Obóz" : "Fala"}
            <div className="unitsContainer inputs60">
                {Array.isArray(items) && items?.length
                    ? items?.map((item: GuideAttackUnit) => (
                          <AttackUnits
                              sendData={sendWave}
                              key={item.unitId}
                              unitId={item.unitId}
                              types={types}
                              item={item}
                              removeUnit={removeUnitItem}
                          />
                      ))
                    : null}
            </div>
            <Button
                variant="success"
                className="attackBtn"
                onClick={handleAddItems}
            >
                Dodaj jednostkę
                <FontAwesomeIcon
                    title="Dodaj jednostkę"
                    icon={faPlusCircle}
                    fontSize={15}
                />
            </Button>
            <Button
                variant="danger"
                className="attackBtn"
                onClick={handleRemoveWave}
            >
                Usuń {isBandits ? "obóz w ataku" : "fale"}
                <FontAwesomeIcon
                    title="Usuń falę"
                    icon={faMinusSquare}
                    fontSize={18}
                />
            </Button>
        </div>
    );
};

export default AttackWave;
