import React, { FC } from "react";
import { Form } from "react-bootstrap";

interface GuideDescriptionProps {
    value?: string;
    onChange: (body: string) => void;
}

const GuideDescription: FC<GuideDescriptionProps> = ({ value, onChange }) => {
    return (
        <Form.Group>
            <Form.Label>Twój opis</Form.Label>
            <Form.Control
                as="textarea"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </Form.Group>
    );
};

export default GuideDescription;
