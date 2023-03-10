import { gql, useMutation, useQuery } from "@apollo/client";
import React, { FC, useEffect, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import {
    _API_VERSION_,
    _CLASS_PADDING_,
    _CLASS_YELLOW_CONTAINER_,
    _SERVER_URL_,
    _URL_GENERALS_,
    _URL_HOME_,
} from "../../../assets/consts";
import GeneralType from "../../../model/GeneralType";
import Select, { SingleValue } from "react-select";
import UpgradeTypesTree from "./UpgradeTypesTree";
import { useNavigate, useParams } from "react-router-dom";
import General from "../../../model/General";
import Loader from "../../Loader/Loader";

export interface GeneralUpgradeTypeItemInterface {
    upgradeType: string;
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
            ... on GeneralType {
                id
                name
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
            ... on General {
                name
                id
                generalType {
                    id
                    name
                }
                upgrades {
                    level
                    id
                    upgradeType {
                        name
                        id
                    }
                }
            }
        }
    }
`;

const EditGeneral: FC = () => {
    const { generalId } = useParams();
    const { data: dataGeneral } = useQuery(GetMyGenerals, {
        fetchPolicy: "no-cache",
        variables: { id: generalId },
    });
    const [general, setGeneral] = useState<General | undefined>(undefined);
    const [generalType, setGeneralType] = useState<any>();
    const [generalUpgradeTypesWithLevel, setGeneralUpgradeTypesWithLevel] =
        useState<GeneralUpgradeTypeItemInterface[]>([]);
    const [generalName, setGeneralName] = useState("");
    const [generalTypes, setGeneralTypes] = useState();
    const [errorMsg, setErrorMsg] = useState("");
    const { data: dataGeneralTypes } = useQuery(GetGeneralTypes);
    const [execSaveGeneral] = useMutation(SaveGeneral);
    const navigate = useNavigate();
    const [shouldRender, setShouldRender] = useState(false);

    const handleUpgradeChange = (
        upgradeChanged: GeneralUpgradeTypeItemInterface
    ) => {
        const updatedGeneralUpgradeTypesWithLevel =
            generalUpgradeTypesWithLevel.map((item) => {
                if (item.upgradeType === upgradeChanged.upgradeType) {
                    return {
                        ...item,
                        level: upgradeChanged.level,
                    };
                }
                return item;
            });

        const isElementFound = updatedGeneralUpgradeTypesWithLevel.some(
            (item) => item.upgradeType === upgradeChanged.upgradeType
        );

        if (!isElementFound) {
            updatedGeneralUpgradeTypesWithLevel.push({
                upgradeType: upgradeChanged.upgradeType,
                level: upgradeChanged.level,
            });
        }

        setGeneralUpgradeTypesWithLevel(updatedGeneralUpgradeTypesWithLevel);
    };

    const [upgradesCategoryContent, setUpgradesCategoryContent] = useState(
        <UpgradeTypesTree sendOutUpgradeItem={handleUpgradeChange} />
    );

    useEffect(() => {
        const options = dataGeneralTypes?.getGeneralTypes.map(
            (item: GeneralType) => createTypeOption(item)
        );

        setGeneralTypes(options);
    }, [dataGeneralTypes]);

    useEffect(() => {
        if (generalId && dataGeneral && dataGeneral.getGenerals) {
            const general = dataGeneral.getGenerals[0];
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
            upgrades: generalUpgradeTypesWithLevel,
        };

        const { data: createGeneralMsg } = await execSaveGeneral({
            variables: { ...newGeneral },
        });

        isNaN(parseInt(createGeneralMsg.saveGeneral, 10))
            ? setErrorMsg(createGeneralMsg)
            : navigate(`${_URL_GENERALS_}`);
    };

    if (generalId && !shouldRender) {
        return <Loader />;
    }
    return (
        <Form>
            <Col
                className={`${_CLASS_YELLOW_CONTAINER_} offset-md-3`}
                md={6}
                xs={12}
            >
                <Col xs={12} className={_CLASS_PADDING_}>
                    <Form.Group>
                        <Form.Label aria-required="true">
                            Twoja nazwa genera??a
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
                            Wybierz ulepszenia
                            {upgradesCategoryContent}
                        </Form.Label>
                    </Form.Group>
                </Col>
            </Col>
            <Col className="mt-2 offset-md-3 p-0" md={6} xs={12}>
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
