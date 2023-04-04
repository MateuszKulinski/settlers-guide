import React, { FC, useState } from "react";
import { Button, Form } from "react-bootstrap";
import useUpdateGuide from "../../hooks/useUpdateGuide";

interface GuideDescriptionProps {
    value?: string;
    guideId?: string;
    onChange: (body?: string) => void;
}

const GuideDescription: FC<GuideDescriptionProps> = ({
    guideId,
    value,
    onChange,
}) => {
    const [description, setDescription] = useState(value);
    const saveGuide = useUpdateGuide();
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (!guideId) onChange && onChange(newValue);
        setDescription(newValue);
    };

    const handleOnSave = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        if (guideId) {
            await saveGuide(guideId, description);
            onChange();
        }
    };

    return (
        <Form.Group>
            <Form.Label>
                Twój opis
                <Form.Control
                    as="textarea"
                    value={description}
                    onChange={handleOnChange}
                />
            </Form.Label>
            {guideId && <Button onClick={handleOnSave}>Zapisz</Button>}
        </Form.Group>
    );
};

export default GuideDescription;
