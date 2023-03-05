import { gql, useMutation, useQuery } from "@apollo/client";
import React, { FC, useEffect, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import {
    _API_VERSION_,
    _CLASS_PADDING_,
    _CLASS_YELLOW_CONTAINER_,
    _SERVER_URL_,
    _URL_HOME_,
} from "../../../assets/consts";
import GeneralType from "../../../model/GeneralType";
import Select, { SingleValue } from "react-select";
import UpgradeTypesTree from "./UpgradeTypesTree";
import { useNavigate } from "react-router-dom";

export interface GeneralUpgradeTypeItemInterface {
    upgradeType: string;
    level: number;
}

interface CreateGeneralInput {
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

const CreateGeneral = gql`
    mutation CreateGeneral(
        $name: String!
        $generalType: ID!
        $upgrades: [GeneralUpgradeInput!]
    ) {
        createGeneral(
            name: $name
            generalType: $generalType
            upgrades: $upgrades
        )
    }
`;

const AddGeneral: FC = () => {
    const [generalType, setGeneralType] = useState<any>();
    const [generalUpgradeTypesWithLevel, setGeneralUpgradeTypesWithLevel] =
        useState<GeneralUpgradeTypeItemInterface[]>([]);
    const [generalName, setGeneralName] = useState("");
    const [generalTypes, setGeneralTypes] = useState();
    const [errorMsg, setErrorMsg] = useState("");
    const { data: dataGeneralTypes } = useQuery(GetGeneralTypes);
    const [execCreateGeneral] = useMutation(CreateGeneral);
    const navigate = useNavigate();

    useEffect(() => {
        const options = dataGeneralTypes?.getGeneralTypes.map(
            (item: GeneralType) => ({
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
            })
        );

        setGeneralTypes(options);
    }, [dataGeneralTypes]);

    const handleGeneralNameChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setGeneralName(e.target.value);
    };

    const handleGeneralTypeChange = (newValue: SingleValue<number>) => {
        setGeneralType(newValue);
    };

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

    const handleOnSubmit = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        console.log(generalUpgradeTypesWithLevel);
        const newGeneral: CreateGeneralInput = {
            name: generalName,
            generalType: generalType?.realValue,
            upgrades: generalUpgradeTypesWithLevel,
        };

        const { data: createGeneralMsg } = await execCreateGeneral({
            variables: { ...newGeneral },
        });

        isNaN(parseInt(createGeneralMsg, 10))
            ? setErrorMsg(createGeneralMsg)
            : navigate(_URL_HOME_);
    };
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
                            Twoja nazwa generała
                            <Form.Control
                                required
                                name="generalName"
                                type="text"
                                onChange={handleGeneralNameChange}
                                isValid={!!generalName}
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
                            <UpgradeTypesTree
                                sendOutUpgradeItem={handleUpgradeChange}
                            />
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
                    Dodaj
                </Button>
            </Col>
        </Form>
    );
};

export default AddGeneral;
