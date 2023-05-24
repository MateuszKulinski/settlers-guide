import React, { FC, useEffect, useReducer, useState } from "react";
import General from "../../../../../model/General";
import { Form } from "react-bootstrap";
import Select, { SingleValue } from "react-select";
import { _API_VERSION_, _SERVER_URL_ } from "../../../../../assets/consts";
import { useSelector } from "react-redux";
import { CampState } from "../../../../../store/camp/Reducer";

interface AttackGeneralProp {
    generalId: string;
    generals: General[];
    changeGeneral: (generalId: string) => void;
}

interface GeneralTypeOption {
    value: string;
    realValue: string;
    label: JSX.Element;
}

const AttackGeneral: FC<AttackGeneralProp> = ({
    generalId,
    generals,
    changeGeneral,
}) => {
    const [generalType, setGeneralType] = useState<any>();
    const [generalTypes, setGeneralTypes] = useState<GeneralTypeOption[]>([]);

    const handleGeneralTypeChange = (newValue: SingleValue<any>) => {
        setGeneralType(newValue);
        changeGeneral(newValue.realValue);
    };

    const createTypeOption = (item: General) => {
        return {
            value: item.name,
            realValue: item.id,
            label: (
                <div className="selectContainer">
                    <span>
                        <img
                            src={`${_SERVER_URL_}/api/${_API_VERSION_}/img/GeneralType/${item.generalType.id}`}
                            alt={`${item.name}`}
                        />
                    </span>
                    <span>{item.name}</span>
                </div>
            ),
        };
    };

    useEffect(() => {
        const general = generals.find((item: General) => item.id === generalId);
        const generalToOption = general || generals[0];
        setGeneralType(createTypeOption(generalToOption));

        const options = generals.map((item: General) => createTypeOption(item));
        setGeneralTypes(options);
    }, [generals]);

    return (
        <div className="attackSelectGeneralContainer">
            {generals ? (
                <Form.Group>
                    <Form.Label>
                        Wybierz generała
                        <Select
                            value={generalType}
                            onChange={handleGeneralTypeChange}
                            options={generalTypes}
                        />
                    </Form.Label>
                </Form.Group>
            ) : null}
        </div>
    );
};

export default AttackGeneral;
