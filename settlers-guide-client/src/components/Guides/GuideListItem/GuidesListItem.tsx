import React, { FC } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { _URL_EDIT_GENERAL_, _URL_EDIT_GUIDE_ } from "../../../assets/consts";
import { Guide } from "../../../model/Guide";
import "./GuidesListItem.css";
import { formatDate } from "../../../common/dates";

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
            <div className="guideListDataContainer">
                <h4>{guide.name}</h4>
                <h6>{guide.adventure.name}</h6>
                <span>
                    {guide.user?.userName}, {formatDate(guide.lastModifiedOn)}
                </span>
            </div>
            <div className="buttonsContainer">
                <Button>
                    <Link to={`${_URL_EDIT_GUIDE_}${guide.id}`}>Edytuj</Link>
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Usuń
                </Button>
            </div>
        </div>
    );
};

export default GuidesListItem;
