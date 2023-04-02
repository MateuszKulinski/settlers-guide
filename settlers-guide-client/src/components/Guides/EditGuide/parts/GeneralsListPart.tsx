import { gql, useQuery } from "@apollo/client";
import React, { FC, useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import General from "../../../../model/General";
import Loader from "../../../Loader/Loader";
import { _API_VERSION_, _SERVER_URL_ } from "../../../../assets/consts";

const GetMyGenerals = gql`
    query General($withPublic: Boolean) {
        getGenerals(withPublic: $withPublic) {
            ... on EntityResult {
                messages
            }
            ... on GeneralArray {
                generals {
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
    }
`;

const GeneralsListPart: FC = () => {
    const [show, setShow] = useState<boolean>(false);
    const [generals, setGenerals] = useState<General[]>([]);
    const [content, setContent] = useState<React.ReactNode>(<Loader />);
    const { data: dataGenerals } = useQuery(GetMyGenerals, {
        fetchPolicy: "no-cache",
        variables: {
            withPublic: true,
        },
    });

    useEffect(() => {
        if (dataGenerals && dataGenerals.getGenerals.generals) {
            setGenerals(dataGenerals.getGenerals.generals);
        }
    }, [dataGenerals]);

    const handleSetCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
        console.log(e.target.name);
    };

    useEffect(() => {
        const newContent = generals.map((general: General) => {
            return (
                <Col
                    key={general.id}
                    md={12}
                    lg={6}
                    className="checkboxGeneralContainer"
                >
                    {" "}
                    <Form.Group>
                        <Form.Label>
                            <Form.Check
                                type="checkbox"
                                onChange={handleSetCheckbox}
                                name={general.id}
                            />
                            <div className="img-container">
                                <img
                                    src={`${_SERVER_URL_}/api/${_API_VERSION_}/img/GeneralType/${general.generalType.id}`}
                                    alt={`${general.name}`}
                                />
                            </div>
                            {general.name}
                        </Form.Label>
                    </Form.Group>
                </Col>
            );
        });
        setContent(newContent);
    }, [generals]);

    console.log(generals);

    return (
        <div id="showHideContainer">
            <div className="showHideTitle">
                <div className="edit-label">Edytuj generałów</div>
                <Button
                    variant="outline-light"
                    className="toggle-button"
                    onClick={() => {
                        setShow(!show);
                    }}
                >
                    {show ? "Ukryj" : "Pokaż"}
                </Button>
            </div>
            <div
                className={`generalsChoiceContainer hideContainer ${
                    show ? "show" : "hide"
                }`}
            >
                <Row className="generalsGuideContainer">{content}</Row>
            </div>
        </div>
    );
};

export default GeneralsListPart;
