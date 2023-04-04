import React, { FC, useState } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";
import useUpdateGuide from "../../hooks/useUpdateGuide";

interface GuideDescriptionProps {
    guideId?: string;
    startValue: number;
    onChange?: (value: number) => void;
}

const GuideType: FC<GuideDescriptionProps> = ({
    guideId,
    startValue,
    onChange,
}) => {
    const [value, setValue] = useState<number>(startValue);
    const saveGuide = useUpdateGuide();

    const options = [
        { value: 1, label: "Prywatny" },
        { value: 2, label: "Znajomi" },
        { value: 3, label: "Wszyscy" },
    ];

    const handleChange = (selectedOption: any) => {
        const newValue = selectedOption ? selectedOption.value : undefined;
        if (onChange) {
            onChange(newValue);
        } else if (guideId) {
            setValue(newValue);
            saveGuide(guideId, undefined, newValue);
        }
    };

    return (
        <Form.Group>
            <Form.Label>
                Widoczność
                <Select
                    value={
                        value
                            ? options.find((option) => option.value === value)
                            : null
                    }
                    onChange={handleChange}
                    options={options}
                />
            </Form.Label>
        </Form.Group>
    );
};

export default GuideType;
