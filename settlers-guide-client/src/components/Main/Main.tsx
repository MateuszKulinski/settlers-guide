import { Col } from "react-bootstrap";
import React from "react";
import "./Main.css";
import { AppState } from "../../store/AppState";
import { useSelector } from "react-redux";
import AdventureCategory from "../../model/AdventureCategory";
import CategoryListItem from "../CategoriesList/CategoryListItem";

const Main: React.FC = () => {
    const categories = useSelector((state: AppState) => state.categories);

    const categoriesContent = categories
        ? categories.map((category: AdventureCategory) => {
              const { adventures, name, id } = category;
              return (
                  <li key={id}>
                      <CategoryListItem
                          id={id}
                          adventures={adventures}
                          name={name}
                      />
                  </li>
              );
          })
        : null;

    return (
        <>
            <Col className="yellowContainer" md={9} xs={12}>
                <Col xs={12} className="p-3"></Col>
            </Col>
            <Col className="yellowContainer" md={3} xs={12}>
                <Col xs={12} className="p-3">
                    <ul className="categoryListContent">{categoriesContent}</ul>
                </Col>
            </Col>
        </>
    );
};

export default Main;
