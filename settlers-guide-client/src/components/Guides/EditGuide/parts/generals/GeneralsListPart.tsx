import { gql, useQuery } from "@apollo/client";
import React, { FC, useEffect, useState } from "react";
import { Button, Row } from "react-bootstrap";
import General from "../../../../../model/General";
import Loader from "../../../../Loader/Loader";
import { _API_VERSION_, _SERVER_URL_ } from "../../../../../assets/consts";
import { Guide } from "../../../../../model/Guide";
import GeneralsListPartItem from "./GeneralsListPartItem";

interface GeneralsListPartProps {
    guide: Guide;
    onUpdate: () => void;
    generals: General[];
}

const GeneralsListPart: FC<GeneralsListPartProps> = ({
    guide,
    generals,
    onUpdate,
}) => {
    const [show, setShow] = useState<boolean>(false);
    const [content, setContent] = useState<React.ReactNode>(<Loader />);

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
