import React, { FC, useRef, useState } from "react";
import UnitBandit from "../../../../../model/UnitBandit";
import { NumericFormat } from "react-number-format";
import Select, { SingleValue } from "react-select";
import { _API_VERSION_, _SERVER_URL_ } from "../../../../../assets/consts";
import GuideAttackUnit from "../../../../../model/GuideAttackUnit";
import { generateUniqueId } from "./AttackCampEditor";
import GuideAttackOpponent from "../../../../../model/GuideAttackOpponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";

interface AttackUnitsProps {
    types: UnitBandit[];
    unitId: string;
    sendData: (data: GuideAttackUnit) => void;
    removeUnit: (unitId: string) => void;
    item?: GuideAttackUnit;
}

const AttackUnits: FC<AttackUnitsProps> = ({
    types,
    sendData,
    removeUnit,
    unitId,
    item,
}) => {
    const [quantityInput, setQuantityInput] = useState<number>(
        item?.quantity ? item.quantity : 0
    );
    const [losesInput, setLosesInput] = useState<number>(0);

    const itemsOptions: any = types.length
        ? types.map((item: UnitBandit) => {
              return {
                  value: item.name,
                  realValue: item.id,
                  keyValue: generateUniqueId(),
                  label: (
                      <div className="selectContainer">
                          <span>
                              <img
                                  src={`${_SERVER_URL_}/api/${_API_VERSION_}/img/Bandit/${item.id}`}
                                  alt={`${item.name}`}
                                  style={{ maxWidth: 20 }}
                              />
                          </span>
                          <span>{item.name}</span>
                      </div>
                  ),
              };
          })
        : null;
    const [itemType, setItemType] = useState<any>(() => {
        if (item && item.typeId !== undefined) {
            return itemsOptions.find(
                (type: any) => type.realValue === item.unitId
            );
        }
    });

    const sendDataToParent = (
        realValue: string,
        newQuantity: number,
        newLoseQuantity: number = 0
    ) => {
        const item: GuideAttackUnit = new GuideAttackUnit(
            unitId,
            newQuantity,
            losesInput,
            realValue
        );
        sendData(item);
    };
    const handleQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(e.target.value);
        setQuantityInput(newQuantity);
        sendDataToParent(itemType?.realValue, newQuantity);
    };
    const handleTypeChange = (newValue: SingleValue<any>) => {
        setItemType(newValue);
        if (newValue?.hasOwnProperty("realValue")) {
            sendDataToParent(newValue?.realValue, quantityInput);
        }
    };

    const handleRemoveItem = (
        e: React.MouseEvent<SVGSVGElement, MouseEvent>
    ) => {
        removeUnit(unitId);
    };

    return (
        <div className="unitContainer">
            {itemsOptions ? (
                <Select
                    value={itemType}
                    onChange={handleTypeChange}
                    options={itemsOptions}
                    className="unitsSelect"
                    menuShouldBlockScroll={true}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={{
                        container: (provided) => ({
                            ...provided,
                            position: "relative",
                            minWidth: 200,
                        }),
                        control: (provided) => ({
                            ...provided,
                            position: "relative",
                            minWidth: 200,
                        }),
                        menu: (provided) => ({
                            ...provided,
                            minWidth: 300,
                        }),
                    }}
                />
            ) : null}

            <NumericFormat
                value={quantityInput}
                className="form-control"
                name="quantity"
                allowNegative={false}
                onChange={handleQuantity}
                decimalScale={0}
            />

            <FontAwesomeIcon
                title="Usuń jednostkę"
                icon={faMinusCircle}
                onClick={handleRemoveItem}
                fontSize={20}
                className="text-danger"
            />
        </div>
    );
};

export default AttackUnits;
