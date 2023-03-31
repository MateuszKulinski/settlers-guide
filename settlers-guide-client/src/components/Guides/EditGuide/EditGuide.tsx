import React, { FC } from "react";
import { Col, Form } from "react-bootstrap";
import { _CLASS_YELLOW_CONTAINER_ } from "../../../assets/consts";
import { useParams } from "react-router-dom";

const EditGuide: FC = () => {
    const { guideId } = useParams();
    console.log(guideId);
    return (
        <Form>
            <Col className={_CLASS_YELLOW_CONTAINER_} xs={12}></Col>
        </Form>
    );
};

export default EditGuide;
