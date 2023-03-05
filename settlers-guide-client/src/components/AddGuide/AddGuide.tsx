import React, { FC, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { _CLASS_PADDING_, _CLASS_YELLOW_CONTAINER_ } from "../../assets/consts";
import Adventure from "../../model/Adventure";
import AdventureCategory from "../../model/AdventureCategory";
import { AppState } from "../../store/AppState";
import "./AddGuide.css";

export type FormControlElement =
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement;

const AddGuide: FC = () => {
    const categories = useSelector((state: AppState) => state.categories);
    const [guideName, setGuideName] = useState("");
    const [category, setCategory] = useState(0);
    const [adventure, setAdventure] = useState(0);

    const handleGuideNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGuideName(e.target.value);
    };

    const handleCategoryChange = (e: React.ChangeEvent<FormControlElement>) => {
        setCategory(parseInt(e.target.value));
    };

    const handleAdventureChange = (
        e: React.ChangeEvent<FormControlElement>
    ) => {
        setAdventure(parseInt(e.target.value));
    };

    const handleOnSubmit = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
    };

    const categoriesOptions = categories?.map((category: AdventureCategory) => {
        return (
            <option value={category.id} key={category.id}>
                {category.name}
            </option>
        );
    });

    const selectedCategoryWithAdventures = categories?.find(
        (cat: AdventureCategory) => cat.id === String(category)
    );

    const adventuresOptions = selectedCategoryWithAdventures?.adventures.map(
        (adventure: Adventure) => {
            return (
                <option value={adventure.id} key={adventure.id}>
                    {adventure.name}
                </option>
            );
        }
    );

    return (
        <Form>
            <Col className={_CLASS_YELLOW_CONTAINER_} xs={12}>
                <Col xs={12} className={_CLASS_PADDING_}>
                    <Form.Group className="col-xs-12">
                        <Form.Label aria-required="true">
                            Twoja nazwa przygody
                            <Form.Control
                                required
                                name="guideName"
                                type="text"
                                onChange={handleGuideNameChange}
                                isValid={!!guideName}
                            ></Form.Control>
                        </Form.Label>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Wybierz kategorię</Form.Label>
                        <Form.Control
                            as="select"
                            value={category}
                            onChange={handleCategoryChange}
                        >
                            <option value="0"></option>
                            {categoriesOptions}
                        </Form.Control>
                    </Form.Group>
                    {adventuresOptions && adventuresOptions.length > 0 && (
                        <Form.Group>
                            <Form.Label>Wybierz przygodę</Form.Label>
                            <Form.Control
                                as="select"
                                value={adventure}
                                onChange={handleAdventureChange}
                            >
                                <option value="0"></option>
                                {adventuresOptions}
                            </Form.Control>
                        </Form.Group>
                    )}
                </Col>
            </Col>
            <Row className="mt-2">
                <Col xs={12}>
                    <Button
                        variant="success"
                        onClick={handleOnSubmit}
                        disabled={!guideName || !adventure}
                        style={{ width: "100%" }}
                    >
                        Dodaj
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default AddGuide;
