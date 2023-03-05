import {
    faChevronCircleDown,
    faChevronCircleUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import Adventure from "../../model/Adventure";
import "./CategoryListItem.css";

interface CategoryListItemProps {
    id: string;
    name: string;
    adventures?: Adventure[];
}

const CategoryListItem: FC<CategoryListItemProps> = ({
    id,
    name,
    adventures,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleIconClick = (
        e: React.MouseEvent<SVGSVGElement, MouseEvent>
    ) => {
        setIsOpen(!isOpen);
    };

    const adventureList = adventures
        ? adventures.map((adventure: Adventure) => {
              const { id, name } = adventure;
              return (
                  <li key={id}>
                      <Link to={`/adventure/${id}`}>{name}</Link>
                  </li>
              );
          })
        : "";

    return (
        <>
            <h5>
                <Link to={`/category/${id}`}>{name}</Link>
                {adventures && adventures.length > 0 && (
                    <FontAwesomeIcon
                        onClick={handleIconClick}
                        icon={isOpen ? faChevronCircleUp : faChevronCircleDown}
                    />
                )}
            </h5>
            {adventures && adventures.length > 0 && (
                <ul className={`adventureListUl ${isOpen ? "open" : "closed"}`}>
                    {adventureList}
                </ul>
            )}
        </>
    );
};

export default CategoryListItem;
