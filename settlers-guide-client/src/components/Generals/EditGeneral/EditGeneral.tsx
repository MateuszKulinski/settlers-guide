import { gql, useMutation, useQuery } from "@apollo/client";
import React, { FC, useEffect, useReducer, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import {
    _API_VERSION_,
    _CLASS_PADDING_,
    _CLASS_YELLOW_CONTAINER_,
    _MAX_GENENERAL_ITEMS_SUM_,
    _SERVER_URL_,
    _URL_ERROR_,
    _URL_GENERALS_,
    _URL_HOME_,
} from "../../../assets/consts";
import GeneralType from "../../../model/GeneralType";
import Select, { SingleValue } from "react-select";
import UpgradeTypesTree from "./UpgradeTypesTree";
import { useNavigate, useParams } from "react-router-dom";
import General from "../../../model/General";
import Loader from "../../Loader/Loader";
import GeneralUpgradeType from "../../../model/GeneralUpgradeType";

export interface GeneralUpgradeTypeItemInterface {
    upgradeType: string | GeneralUpgradeType;
    level: number;
}

interface CreateGeneralInput {
    generalId?: string;
    name: string;
    generalType: string;
    upgrades: GeneralUpgradeTypeItemInterface[];
}

const GetGeneralTypes = gql`
    query {
        getGeneralTypes {
            ... on EntityResult {
                messages
            }
            ... on GeneralTypeArray {
                types {
                    name
                    id
                }
            }
        }
    }
`;

const SaveGeneral = gql`
    mutation SaveGeneral(
        $generalId: ID
        $name: String!
        $generalType: ID!
        $upgrades: [GeneralUpgradeInput!]
    ) {
        saveGeneral(
            generalId: $generalId
            name: $name
            generalType: $generalType
            upgrades: $upgrades
        )
    }
`;

const GetMyGenerals = gql`
    query GetGenerals($id: ID!) {
        getGenerals(id: $id) {
            ... on EntityResult {
                messages
            }
            ... on GeneralArray {
                generals {
                    name
                    id
                    upgrades {
                        upgradeType {
                            id
                            name
                        }
                        level
                        id
                    }
                    generalType {
                        name
                        id
                    }
                }
            }
        }
    }
`;

function reducer(
    state: {
        upgradeTypes: GeneralUpgradeTypeItemInterface[];
        totalLevel: number;
    },
    action: { type: string; payload: GeneralUpgradeTypeItemInterface[] }
) {
    switch (action.type) {
        case "add":
            const upgradeTypes = action.payload.map((item) => {
                let upgradeTypeId = "";
                if (
                    typeof item.upgradeType !== "string" &&
                    "id" in item.upgradeType
                ) {
                    upgradeTypeId = item.upgradeType.id;
                } else {
                    upgradeTypeId = item.upgradeType;
                }
                return {
                    upgradeType: upgradeTypeId,
                    level: item.level,
                };
            });

            const sumAdd = upgradeTypes.reduce(
                (accumulator, currentValue) => accumulator + currentValue.level,
                0
            );

            return {
                upgradeTypes: upgradeTypes,
                totalLevel: sumAdd,
            };
        case "update":
            const { upgradeType } = action.payload[0];
            const { level } = action.payload[0];
            const updatedGeneralUpgradeTypesWithLevel = state.upgradeTypes.map(
                (item) => {
                    if (item.upgradeType === upgradeType) {
                        return {
                            ...item,
                            level: level,
                        };
                    }
                    return item;
                }
            );

            const isElementFound = updatedGeneralUpgradeTypesWithLevel.some(
                (item) => item.upgradeType === upgradeType
            );

            if (!isElementFound) {
                updatedGeneralUpgradeTypesWithLevel.push({
                    upgradeType: upgradeType,
                    level: level,
                });
            }

            const sum = updatedGeneralUpgradeTypesWithLevel.reduce(
                (accumulator, currentValue) => accumulator + currentValue.level,
                0
            );

            return {
                upgradeTypes: updatedGeneralUpgradeTypesWithLevel,
                totalLevel: sum,
            };

        default:
            return state;
    }
}

const initialState = {
    upgradeTypes: [],
    totalLevel: 0,
};

const EditGeneral: FC = () => {
    const { generalId } = useParams();
    const { data: dataGeneral } = useQuery(GetMyGenerals, {
        fetchPolicy: "no-cache",
        variables: { id: generalId },
    });
    const [general, setGeneral] = useState<General | undefined>(undefined);
    const [generalType, setGeneralType] = useState<any>();
    const [generalUpgradeTypesWithLevel, dispatch] = useReducer(
        reducer,
        initialState
    );

    const [generalName, setGeneralName] = useState<string>("");
    const [generalTypes, setGeneralTypes] = useState();
    const [errorMsg, setErrorMsg] = useState<string>("");
    const { data: dataGeneralTypes } = useQuery(GetGeneralTypes);
    const [execSaveGeneral] = useMutation(SaveGeneral);
    const navigate = useNavigate();
    const [shouldRender, setShouldRender] = useState<boolean>(false);

    const handleUpgradeChange = async (
        upgradeChanged: GeneralUpgradeTypeItemInterface
    ) => {
        const newItem: GeneralUpgradeTypeItemInterface = {
            upgradeType: upgradeChanged.upgradeType,
            level: upgradeChanged.level,
        };
        dispatch({ type: "update", payload: [newItem] });
    };

    const [upgradesCategoryContent, setUpgradesCategoryContent] = useState(
        <UpgradeTypesTree sendOutUpgradeItem={handleUpgradeChange} />
    );

    useEffect(() => {
        const options = dataGeneralTypes?.getGeneralTypes.types.map(
            (item: GeneralType) => createTypeOption(item)
        );
        setGeneralTypes(options);
    }, [dataGeneralTypes]);

    useEffect(() => {
        if (generalId && dataGeneral && dataGeneral.getGenerals) {
            if (dataGeneral.getGenerals.messages) {
                navigate(`${_URL_ERROR_}`, { replace: true });
            } else if (dataGeneral.getGenerals.generals) {
                const general = dataGeneral.getGenerals.generals[0];
                dispatch({ type: "add", payload: general.upgrades });
                setGeneralName(general.name);
                setGeneralType(createTypeOption(general.generalType));
                setUpgradesCategoryContent(
                    <UpgradeTypesTree
                        sendOutUpgradeItem={handleUpgradeChange}
                        generalUpgrades={general?.upgrades}
                    />
                );
                setShouldRender(true);
                setGeneral(general);
            }
        }
    }, [dataGeneral]);

    const createTypeOption = (item: GeneralType) => {
        return {
            value: item.name,
            realValue: item.id,
            label: (
                <div className="selectContainer">
                    <span>
                        <img
                            src={`${_SERVER_URL_}/api/${_API_VERSION_}/img/GeneralType/${item.id}`}
                            alt={`${item.name}`}
                        />
                    </span>
                    <span>{item.name}</span>
                </div>
            ),
        };
    };

    const handleGeneralNameChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setGeneralName(e.target.value);
    };

    const handleGeneralTypeChange = (newValue: SingleValue<number>) => {
        setGeneralType(newValue);
    };

    const handleOnSubmit = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        const newGeneral: CreateGeneralInput = {
            generalId: generalId,
            name: generalName,
            generalType: generalType?.realValue,
            upgrades: generalUpgradeTypesWithLevel.upgradeTypes,
        };

        const { data: createGeneralMsg } = await execSaveGeneral({
            variables: { ...newGeneral },
        });

        isNaN(parseInt(createGeneralMsg.saveGeneral, 10))
            ? setErrorMsg(createGeneralMsg)
            : navigate(`${_URL_GENERALS_}`);
    };

    const goBack = () => {
        navigate(`${_URL_GENERALS_}`, { replace: true });
    };

    if (generalId && !shouldRender) {
        return <Loader />;
    }

    return (
        <Form>
            {errorMsg}
            <Col
                className={`${_CLASS_YELLOW_CONTAINER_} offset-md-3`}
                md={6}
                xs={12}
            >
                <Col xs={12} className={_CLASS_PADDING_}>
                    <Form.Group>
                        <Form.Label aria-required="true">
                            Twoja nazwa generała
                            <Form.Control
                                required
                                name="generalName"
                                type="text"
                                onChange={handleGeneralNameChange}
                                isValid={!!generalName}
                                value={generalName}
                            ></Form.Control>
                        </Form.Label>
                    </Form.Group>
                    {generalTypes ? (
                        <Form.Group>
                            <Form.Label>
                                Wybierz typ
                                <Select
                                    value={generalType}
                                    onChange={handleGeneralTypeChange}
                                    options={generalTypes}
                                />
                            </Form.Label>
                        </Form.Group>
                    ) : null}
                    <Form.Group>
                        <Form.Label>
                            Wybierz ulepszenia{" "}
                            {generalUpgradeTypesWithLevel.totalLevel}/
                            {_MAX_GENENERAL_ITEMS_SUM_}
                            {upgradesCategoryContent}
                        </Form.Label>
                    </Form.Group>
                </Col>
            </Col>
            <Col className="mt-2 offset-md-3 p-0 pb-3" md={6} xs={12}>
                <Button
                    variant="danger"
                    onClick={goBack}
                    style={{ width: "100%" }}
                    className="mb-2"
                >
                    Cofnij
                </Button>
                <Button
                    variant="success"
                    onClick={handleOnSubmit}
                    style={{ width: "100%" }}
                    disabled={!generalName || !generalType}
                >
                    {general ? "Zapisz" : "Dodaj"}
                </Button>
            </Col>
        </Form>
    );
};

export default EditGeneral;
