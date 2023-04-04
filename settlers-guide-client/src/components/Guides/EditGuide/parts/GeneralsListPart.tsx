import { gql, useMutation, useQuery } from "@apollo/client";
import React, { FC, useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import General from "../../../../model/General";
import Loader from "../../../Loader/Loader";
import { _API_VERSION_, _SERVER_URL_ } from "../../../../assets/consts";
import { Guide } from "../../../../model/Guide";
import GeneralsListPartItem from "./GeneralsListPartItem";

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

interface GeneralsListParttProps {
    guide: Guide;
    onUpdate: () => void;
}

const GeneralsListPart: FC<GeneralsListParttProps> = ({ guide, onUpdate }) => {
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

    useEffect(() => {
        const newContent = generals.map((general: General) => {
            const checked =
                guide.generals?.some(
                    (guideGeneral) => guideGeneral.id === general.id
                ) ?? false;
            return (
                <GeneralsListPartItem
                    key={general.id}
                    guideId={guide.id ?? ``}
                    general={general}
                    checkedOnStart={checked}
                />
            );
        });
        setContent(newContent);
    }, [generals]);

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
