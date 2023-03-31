import React, { FC, useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import {
    _API_VERSION_,
    _CLASS_PADDING_,
    _CLASS_YELLOW_CONTAINER_,
    _SERVER_URL_,
    _URL_GUIDES_,
} from "../../../assets/consts";
import Adventure from "../../../model/Adventure";
import AdventureCategory from "../../../model/AdventureCategory";
import { AppState } from "../../../store/AppState";
import Select, { SingleValue } from "react-select";
import "./AddGuide.css";
import GuideDescription from "../GuideDescription";
import GuideType from "../GuideType";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

export interface AddGuideInterface {
    name: string;
    adventureId: number;
    type: number;
    description: string;
    id?: string;
}

const AddGuideGQL = gql`
    mutation AddGuide(
        $name: String!
        $description: String
        $type: Int!
        $adventureId: ID!
    ) {
        addGuide(
            name: $name
            description: $description
            type: $type
            adventureId: $adventureId
        )
    }
`;

export type FormControlElement =
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement;

const AddGuide: FC = () => {
    const categories = useSelector((state: AppState) => state.categories);
    const [guideName, setGuideName] = useState("");
    const [category, setCategory] = useState<any>();
    const [categoriesOptions, setCategoriesOptions] = useState<any>();
    const [adventure, setAdventure] = useState<any>();
    const [adventuresOptions, setAdventuresOptions] = useState<any>();
    const [description, setDescription] = useState<string>("");
    const [type, setType] = useState<number>(0);
    const [execAddGuideGQL] = useMutation(AddGuideGQL);
    const [errorMsg, setErrorMsg] = useState<string>("");
    const navigate = useNavigate();

    const handleGuideNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGuideName(e.target.value);
    };

    const createCategoryOption = (item: AdventureCategory) => {
        return {
            value: item.name,
            realValue: item.id,
            label: (
                <div className="selectContainer">
                    <span>{item.name}</span>
                </div>
            ),
        };
    };

    const createAdventureOption = (item: Adventure) => {
        return {
            value: item.name,
            realValue: item.id,
            label: (
                <div className="selectContainer">
                    <span>
                        <img
                            src={`${_SERVER_URL_}/api/${_API_VERSION_}/img/Adventure/${item.id}`}
                            alt={`${item.name}`}
                        />
                    </span>
                    <span>{item.name}</span>
                </div>
            ),
        };
    };

    const handleDescriptionChange = (description: string) => {
        setDescription(description);
    };

    const handleTypeChange = (type: number) => {
        setType(type);
    };

    useEffect(() => {
        const options = categories?.map((item: AdventureCategory) =>
            createCategoryOption(item)
        );
        setCategoriesOptions(options);
    }, [categories]);

    useEffect(() => {
        const selectedCategoryWithAdventures = categories?.find(
            (cat: AdventureCategory) => cat.id === String(category?.realValue)
        );
        const adventuresOptionsContent =
            selectedCategoryWithAdventures?.adventures.map(
                (adventure: Adventure) => createAdventureOption(adventure)
            );
        setAdventuresOptions(adventuresOptionsContent);
    }, [category]);

    const handleCategoryChange = (newValue: SingleValue<number>) => {
        setCategory(newValue);
        setAdventure(null);
    };

    const handleAdventureChange = (newValue: SingleValue<number>) => {
        setAdventure(newValue);
    };

    const handleOnSubmit = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        const newGuideCategory = categories?.find(
            (item) => item.id === category.realValue
        );

        const newGuideAdventure = newGuideCategory?.adventures.find(
            (item) => item.id === adventure.realValue
        );
        if (newGuideCategory && newGuideAdventure) {
            const newGuide: AddGuideInterface = {
                name: guideName,
                description,
                type,
                adventureId: parseInt(newGuideAdventure?.id),
            };

            const { data: newGuideMsg } = await execAddGuideGQL({
                variables: { ...newGuide },
            });

            isNaN(parseInt(newGuideMsg.addGuide, 10))
                ? setErrorMsg(newGuideMsg)
                : navigate(`${_URL_GUIDES_}`);
        }
    };

    return (
        <Form>
            {errorMsg}
            <Col className={_CLASS_YELLOW_CONTAINER_} xs={12}>
                <Col xs={12} className={_CLASS_PADDING_}>
                    <Form.Group>
                        <Form.Label aria-required="true">
                            Twoja nazwa poradnika
                            <Form.Control
                                required
                                name="guideName"
                                type="text"
                                onChange={handleGuideNameChange}
                                isValid={!!guideName}
                            ></Form.Control>
                        </Form.Label>
                    </Form.Group>
                    {categoriesOptions ? (
                        <Form.Group>
                            <Form.Label>
                                Wybierz kategorię
                                <Select
                                    value={category}
                                    onChange={handleCategoryChange}
                                    options={categoriesOptions}
                                />
                            </Form.Label>
                        </Form.Group>
                    ) : null}
                    {adventuresOptions && adventuresOptions.length > 0 && (
                        <Form.Group>
                            <Form.Label>
                                Wybierz przygodę
                                <Select
                                    value={adventure}
                                    onChange={handleAdventureChange}
                                    options={adventuresOptions}
                                />
                            </Form.Label>
                        </Form.Group>
                    )}
                    <GuideDescription
                        onChange={handleDescriptionChange}
                        value={description}
                    />
                    <GuideType onChange={handleTypeChange} value={type} />
                </Col>
            </Col>
            <Row className="mt-2">
                <Col xs={12}>
                    <Button
                        variant="success"
                        onClick={handleOnSubmit}
                        disabled={!guideName || !adventure || !type}
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
