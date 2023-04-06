import React, { FC, useState } from "react";
import { Guide } from "../../../../model/Guide";
import { Button } from "react-bootstrap";
import AttacksListPartItem from "./AttacksListPartItem";

interface AttackListPartProp {
    guide: Guide;
}

const AttackListPartProp: FC<AttackListPartProp> = ({ guide }) => {
    const [show, setShow] = useState<boolean>(false);
    const [content, setContent] = useState<string>("");

    return (
        <div id="showHideContainer">
            <div className="showHideTitle">
                <div className="edit-label">Edytuj ataki</div>
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
                className={`dropZoneContainer hideContainer ${
                    show ? "show" : "hide"
                }`}
            >
                <AttacksListPartItem />
                {content}
            </div>
        </div>
    );
};

export default AttackListPartProp;
