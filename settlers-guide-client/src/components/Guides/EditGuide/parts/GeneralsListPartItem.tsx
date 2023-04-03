import { gql, useMutation } from "@apollo/client";
import React, { FC, useState } from "react";
import { Col, Form } from "react-bootstrap";
import General from "../../../../model/General";
import { _API_VERSION_, _SERVER_URL_ } from "../../../../assets/consts";

interface GeneralsListParttProps {
    general: General;
    guideId: string;
    checkedOnStart: boolean;
}

const ChangeGuideGeneral = gql`
    mutation ChangeGuideGeneral(
        $generalId: ID!
        $guideId: ID!
        $checked: Boolean!
    ) {
        changeGuideGeneral(
            generalId: $generalId
            guideId: $guideId
            checked: $checked
        ) {
            ... on EntityResult {
                messages
            }
            ... on BooleanResult {
                data
            }
        }
    }
`;

const GeneralsListPartItem: FC<GeneralsListParttProps> = ({
    general,
    guideId,
    checkedOnStart,
}) => {
    const [execChangeGuideGeneral] = useMutation(ChangeGuideGeneral);
    const [error, setError] = useState<string>("");
    const [checked, setChecked] = useState<boolean>(checkedOnStart);

    const handleSetCheckbox = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newChecked = !checked;
        const generalId = e.target.name;
        const { data: execChangeGuideGeneralResult } =
            await execChangeGuideGeneral({
                variables: {
                    generalId,
                    guideId,
                    checked: newChecked,
                },
            });
        if (execChangeGuideGeneralResult.changeGuideGeneral.messages) {
            setError(
                execChangeGuideGeneralResult.changeGuideGeneral.messages[0]
            );
        } else {
            setChecked(newChecked);
            setError("");
        }
    };

    return (
        <Col
            key={general.id}
            md={12}
            lg={6}
            className="checkboxGeneralContainer"
        >
            {error}
            <Form.Group>
                <Form.Label>
                    <Form.Check
                        type="checkbox"
                        onChange={handleSetCheckbox}
                        name={general.id}
                        checked={checked}
                    />
                    <div className="img-container">
                        <img
                            src={`${_SERVER_URL_}/api/${_API_VERSION_}/img/GeneralType/${general.generalType.id}`}
                            alt={`${general.name}`}
                        />
                    </div>
                    {general.name}
                </Form.Label>
            </Form.Group>
        </Col>
    );
};

export default GeneralsListPartItem;
