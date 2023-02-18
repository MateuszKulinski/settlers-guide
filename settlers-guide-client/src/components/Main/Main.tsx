import React from "react";
import "./Main.css";
import { Container, Row, Col } from "react-bootstrap";

const Main = () => {
    return (
        <>
            <Container className="container-main" fluid="md">
                <Row>
                    <Col md={9} xs={12}>
                        <Col xs={12} className="p-3">
                            Pierwsza kolumna z zawartością
                        </Col>
                    </Col>
                    <Col md={3} xs={12}>
                        <Col xs={12} className="p-3">
                            Druga kolumna z zawartością
                        </Col>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Main;
