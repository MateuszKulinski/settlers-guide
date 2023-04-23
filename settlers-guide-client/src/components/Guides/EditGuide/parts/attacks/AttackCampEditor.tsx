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

interface AttackCampEditorProp {
    banditTypes: UnitBandit[];
    unitTypes: UnitBandit[];
}

interface CampState {
    waves: Wave[];
    resultMsg: string;
}

type CampAction =
    | { type: "addBanditsWave"; payload: string }
    | { type: "removeBanditsWave"; payload: string }
    | { type: "removeBandits"; payload: { waveId: string; unitId: string } }
    | {
          type: "editBandits";
          payload: { waveId: string; data: GuideAttackUnit };
      };

const campReducer = (state: CampState, action: CampAction) => {
    const { waves } = state;
    console.log(waves);

    switch (action.type) {
        case "addBanditsWave": {
            const newWave: Wave = {
                waveId: action.payload,
                items: [new GuideAttackUnit(generateUniqueId(), 0, 0)],
            };
            return { ...state, waves: [...waves, newWave] };
        }
        case "removeBanditsWave": {
            const waveIdToRemove = action.payload;
            const updatedWaves = waves.filter(
                (wave: Wave) => wave.waveId !== waveIdToRemove
            );
            return { ...state, waves: updatedWaves };
        }
        case "editBandits": {
            const { waveId, data } = action.payload;
            const updatedWaves = [...waves];

            const waveIndex = updatedWaves.findIndex(
                (wave: Wave) => wave.waveId === waveId
            );
            if (waveIndex === -1) {
                return { ...state };
            }

            const currentWave = updatedWaves[waveIndex];
            if (currentWave.items.length === 0) {
                currentWave.items.push(data);
            } else {
                const unitIndex = currentWave.items.findIndex(
                    (item: GuideAttackUnit) => item.unitId === data.unitId
                );
                if (unitIndex === -1) {
                    currentWave.items.push(data);
                } else {
                    currentWave.items[unitIndex] = data;
                }
            }

            return { ...state, waves: [...updatedWaves] };
        }
        case "removeBandits": {
            const { waveId, unitId } = action.payload;
            const updatedWaves = [...waves];

            const waveIndex = updatedWaves.findIndex(
                (wave: Wave) => wave.waveId === waveId
            );
            if (waveIndex === -1) {
                return { ...state };
            }

            const currentWave = state.waves[waveIndex];
            const unitIndex = currentWave.items.findIndex(
                (item: GuideAttackUnit) => item.unitId === unitId
            );
            if (unitIndex === -1) {
                return { ...state };
            } else {
                currentWave.items.splice(unitIndex, 1);
                return { ...state, waves: [...updatedWaves] };
            }
        }
        default:
            return {
                ...state,
                resultMsg: "Błąd. Skontaktuj się z administratorem strony",
            };
    }
};

export const generateUniqueId = (): string => {
    const randomChars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const idLength = 8;
    let id = "";
    for (let i = 0; i < idLength; i++) {
        id += randomChars.charAt(
            Math.floor(Math.random() * randomChars.length)
        );
    }

    return id;
};

const initialCampState: CampState = {
    waves: [
        {
            waveId: generateUniqueId(),
            items: [new GuideAttackUnit(generateUniqueId(), 0, 0)],
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
    const [{ waves }, dispatch] = useReducer(campReducer, initialCampState);
    useEffect(() => {
        setBanditsWavesContent(createWavesContent(true));
    }, [waves, reRender]);

    const saveAttack = (data: GuideAttackUnit, waveId: string) => {
        const newItem = {
            data,
            waveId,
        };
        dispatch({ type: "editBandits", payload: newItem });
    };

    const removeBanditsWave = (waveId: string) => {
        dispatch({ type: "removeBanditsWave", payload: waveId });
    };

    const addUnit = (waveId: string, data: GuideAttackUnit) => {
        dispatch({ type: "editBandits", payload: { waveId, data } });
        setReRender((prevState) => prevState + 1);
    };

    const removeUnit = (waveId: string, unitId: string) => {
        dispatch({ type: "removeBandits", payload: { waveId, unitId } });
        setReRender((prevState) => prevState + 1);
    };

    const createWavesContent = (isBandits: boolean, newWaveId?: string) => {
        const content = waves.length
            ? waves?.map((wave: Wave) => {
                  return (
                      <AttackWave
                          key={wave.waveId}
                          waveId={wave.waveId}
                          items={isBandits ? wave.items : []}
                          types={isBandits ? banditTypes : unitTypes}
                          isBandits={isBandits}
                          saveAttack={saveAttack}
                          removeWave={removeBanditsWave}
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
        const newWaveId = generateUniqueId();
        dispatch({ type: "addBanditsWave", payload: newWaveId });
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
            <div>
                <h6>Nasze jednostki</h6>
            </div>
        </Row>
    );
};

export default AttackCampEditor;
