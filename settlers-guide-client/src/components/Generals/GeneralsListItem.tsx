import React, { FC } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { _URL_EDIT_GENERAL_ } from "../../assets/consts";
import General from "../../model/General";
import "./GeneralsListItem.css";

interface GeneralsListItemProps {
    general: General;
}

const GeneralsListItem: FC<GeneralsListItemProps> = ({ general }) => {
    return (
        <div className="generalItem">
            <h6>{general.name}</h6>
            <div className="buttonsContainer">
                <Button>
                    <Link to={`${_URL_EDIT_GENERAL_}${general.id}`}>
                        Edytuj
                    </Link>
                </Button>
                <Button variant="danger">
                    <Link to={`${_URL_EDIT_GENERAL_}${general.id}`}>Usuń</Link>
                </Button>
            </div>
        </div>
    );
};

export default GeneralsListItem;
