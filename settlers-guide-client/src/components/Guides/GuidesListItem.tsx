import React, { FC } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { _URL_EDIT_GENERAL_ } from "../../assets/consts";
import { Guide } from "../../model/Guide";
import "./GuidesListItem.css";

interface GuidesListItemProps {
    guide: Guide;
    onDelete: (guideId: string) => void;
}

const GuidesListItem: FC<GuidesListItemProps> = ({ guide, onDelete }) => {
    const handleDelete = () => {
        guide.id && onDelete(guide.id);
    };

    return (
        <div className="generalItem">
            <h6>{guide.name}</h6>
            <div className="buttonsContainer">
                <Button>
                    <Link to={`${_URL_EDIT_GENERAL_}${guide.id}`}>Edytuj</Link>
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Usuń
                </Button>
            </div>
        </div>
    );
};

export default GuidesListItem;
