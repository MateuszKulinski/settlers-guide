import React, { FC } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";

interface GuideDescriptionProps {
    value?: number;
    onChange: (value: number) => void;
}

const GuideType: FC<GuideDescriptionProps> = ({ value, onChange }) => {
    const options = [
        { value: 1, label: "Prywatny" },
        { value: 2, label: "Znajomi" },
        { value: 3, label: "Wszyscy" },
    ];

    const handleChange = (selectedOption: any) => {
        const value = selectedOption ? selectedOption.value : undefined;
        onChange(value);
    };

    return (
        <Form.Group>
            <Form.Label>Twój opis</Form.Label>
            <Select
                value={
                    value
                        ? options.find((option) => option.value === value)
                        : null
                }
                onChange={handleChange}
                options={options}
            />
        </Form.Group>
    );
};

export default GuideType;
