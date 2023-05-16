import React, { FC, useEffect, useReducer, useState } from "react";
import UnitBandit from "../../../../../model/UnitBandit";
import { Button, Form, Row } from "react-bootstrap";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./AttackCampEditor.css";
import { NumericFormat } from "react-number-format";
import GuideAttackUnit from "../../../../../model/GuideAttackUnit";
import AttackWave from "./AttacksWave";
import Wave from "../../../../../model/Wave";
import { _GENERATE_UNIQUE_ID_ } from "../../../../../assets/consts";
import {
    CampReducer,
    CampState,
    _REDUCER_ADD_BANDITS_WAVE_,
    _REDUCER_ADD_UNITS_WAVE_,
    _REDUCER_EDIT_BANDITS_,
    _REDUCER_EDIT_UNITS_,
    _REDUCER_REMOVE_BANDITS_,
    _REDUCER_REMOVE_BANDITS_WAVE_,
    _REDUCER_REMOVE_UNITS_,
    _REDUCER_REMOVE_UNITS_WAVE_,
} from "../../../../../store/camp/Reducer";

interface AttackCampEditorProp {
    banditTypes: UnitBandit[];
    unitTypes: UnitBandit[];
}

const initialCampState: CampState = {
    wavesBandits: [
        {
            waveId: _GENERATE_UNIQUE_ID_(),
            items: [new GuideAttackUnit(_GENERATE_UNIQUE_ID_(), 0, 0)],
        },
    ],
    wavesUnits: [
        {
            waveId: _GENERATE_UNIQUE_ID_(),
            items: [new GuideAttackUnit(_GENERATE_UNIQUE_ID_(), 0, 0)],
            generalId: "0",
        },
    ],
    resultMsg: "",
};

const AttackCampEditor: FC<AttackCampEditorProp> = ({
    banditTypes,
    unitTypes,
}) => {
    const [reRender, setReRender] = useState<number>(1);
    const [camp, setCamp] = useState<number>(1);
    const [garrison, setGarrison] = useState<number>(1);
    const [{ wavesBandits, wavesUnits }, dispatch] = useReducer(
        CampReducer,
        initialCampState
    );

    useEffect(() => {
        setBanditsWavesContent(createWavesContent(true));
    }, [wavesBandits, reRender]);

    useEffect(() => {
        setUnitsWavesContent(createWavesContent(false));
    }, [wavesUnits, reRender]);

    const saveAttack = (
        waveId: string,
        data: GuideAttackUnit,
        isBandits: boolean
    ) => {
        const newItem = {
            data,
            waveId,
        };
        const actionType = isBandits
            ? _REDUCER_EDIT_BANDITS_
            : _REDUCER_EDIT_UNITS_;
        dispatch({ type: actionType, payload: newItem });
    };

    const removeWave = (waveId: string, isBandits: boolean) => {
        const actionType = isBandits
            ? _REDUCER_REMOVE_BANDITS_WAVE_
            : _REDUCER_REMOVE_UNITS_WAVE_;
        dispatch({ type: actionType, payload: waveId });
    };

    const addUnit = (
        waveId: string,
        data: GuideAttackUnit,
        isBandits: boolean
    ) => {
        const actionType = isBandits
            ? _REDUCER_EDIT_BANDITS_
            : _REDUCER_EDIT_UNITS_;
        dispatch({ type: actionType, payload: { waveId, data } });
        setReRender((prevState) => prevState + 1);
    };

    const removeUnit = (waveId: string, unitId: string, isBandits: boolean) => {
        const actionType = isBandits
            ? _REDUCER_REMOVE_BANDITS_
            : _REDUCER_REMOVE_UNITS_;
        dispatch({ type: actionType, payload: { waveId, unitId } });
        setReRender((prevState) => prevState + 1);
    };

    const createWavesContent = (isBandits: boolean, newWaveId?: string) => {
        const content = isBandits
            ? wavesBandits.length
                ? wavesBandits?.map((wave: Wave) => {
                      return (
                          <AttackWave
                              key={wave.waveId}
                              waveId={wave.waveId}
                              items={wave.items}
                              types={isBandits ? banditTypes : unitTypes}
                              isBandits={isBandits}
                              saveAttack={saveAttack}
                              removeWave={removeWave}
                              addUnit={addUnit}
                              removeUnit={removeUnit}
                          />
                      );
                  })
                : null
            : wavesUnits.length
            ? wavesUnits?.map((wave: Wave) => {
                  return (
                      <AttackWave
                          key={wave.waveId}
                          waveId={wave.waveId}
                          items={wave.items}
                          types={isBandits ? banditTypes : unitTypes}
                          isBandits={isBandits}
                          saveAttack={saveAttack}
                          removeWave={removeWave}
                          addUnit={addUnit}
                          removeUnit={removeUnit}
                      />
                  );
              })
            : null;

        return [content];
    };

    const [banditsWavesContent, setBanditsWavesContent] = useState<
        React.ReactNode[]
    >(createWavesContent(true));

    const [unitsWavesContent, setUnitsWavesContent] = useState<
        React.ReactNode[]
    >(createWavesContent(false));

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const stateName = e.target.name;
        const { value } = e.target;
        switch (stateName) {
            case "camp":
                setCamp(parseInt(value));
                break;
            case "garrison":
                setGarrison(parseInt(value.substring(1)));
                break;
        }
    };
    const handleAddBanditsWave = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        const newWaveId = _GENERATE_UNIQUE_ID_();
        dispatch({ type: _REDUCER_ADD_BANDITS_WAVE_, payload: newWaveId });
    };

    const handleAddUnitsWave = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        const newWaveId = _GENERATE_UNIQUE_ID_();
        dispatch({ type: _REDUCER_ADD_UNITS_WAVE_, payload: newWaveId });
    };

    return (
        <Row className="inputs100 pb-150">
            <Form.Group className="col-6">
                <Form.Label className="flex-right">
                    Garnizon
                    <NumericFormat
                        value={garrison}
                        className="form-control"
                        name="garrison"
                        allowNegative={false}
                        prefix="G"
                        onChange={handleOnChange}
                        decimalScale={0}
                    />
                </Form.Label>
            </Form.Group>
            <Form.Group className="col-6">
                <Form.Label>
                    Obóz
                    <NumericFormat
                        value={camp}
                        className="form-control"
                        name="camp"
                        allowNegative={false}
                        onChange={handleOnChange}
                        decimalScale={0}
                    />
                </Form.Label>
            </Form.Group>
            <Form.Group className="col-12">
                <Form.Label className="text-center">
                    Wrogie jednostki
                    {banditsWavesContent}
                    <div className="unitContainer">
                        <Button
                            variant="success"
                            className="attackBtn"
                            onClick={handleAddBanditsWave}
                        >
                            Dodaj obóz w ataku
                            <FontAwesomeIcon
                                icon={faPlusSquare}
                                fontSize={18}
                                color="#fff"
                            />
                        </Button>
                    </div>
                </Form.Label>
            </Form.Group>

            <Form.Group className="col-12">
                <Form.Label className="text-center">
                    Nasze jednostki
                    {unitsWavesContent}
                    <div className="unitContainer">
                        <Button
                            variant="success"
                            className="attackBtn"
                            onClick={handleAddUnitsWave}
                        >
                            Dodaj falę
                            <FontAwesomeIcon
                                icon={faPlusSquare}
                                fontSize={18}
                                color="#fff"
                            />
                        </Button>
                    </div>
                </Form.Label>
            </Form.Group>
        </Row>
    );
};

export default AttackCampEditor;
