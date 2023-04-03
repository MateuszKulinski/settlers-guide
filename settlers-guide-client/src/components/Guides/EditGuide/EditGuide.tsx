import React, { FC, useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";
import {
    _CLASS_PADDING_,
    _CLASS_YELLOW_CONTAINER_,
} from "../../../assets/consts";
import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Guide } from "../../../model/Guide";
import { formatDate } from "../../../common/dates";
import ImagePart from "./parts/ImagePart";
import "./EditGuide.css";
import GeneralsListPart from "./parts/GeneralsListPart";

const GetMyGuides = gql`
    query Guides($id: ID!) {
        getGuides(id: $id) {
            ... on EntityResult {
                messages
            }
            ... on GuideArray {
                guides {
                    id
                    name
                    lastModifiedOn
                    adventure {
                        name
                    }
                    user {
                        userName
                    }
                    image {
                        id
                        fileName
                    }
                    generals {
                        id
                    }
                }
            }
        }
    }
`;

const EditGuide: FC = () => {
    const { guideId } = useParams();
    const { data: dataGuides, refetch } = useQuery(GetMyGuides, {
        fetchPolicy: "no-cache",
        variables: { id: guideId },
    });
    const [guide, setGuide] = useState<Guide>();

    useEffect(() => {
        if (dataGuides && dataGuides.getGuides.guides) {
            setGuide(
                dataGuides.getGuides.guides[0]
                    ? dataGuides.getGuides.guides[0]
                    : null
            );
        }
    }, [dataGuides]);

    const onUpdatePhoto = () => {
        refetch();
    };

    return (
        <Form>
            {guide && guideId && (
                <Col className={_CLASS_YELLOW_CONTAINER_} xs={12}>
                    <Col
                        xs={12}
                        className={`${_CLASS_PADDING_} guideListDataContainer `}
                    >
                        <div>
                            <h4>{guide.name}</h4>
                            <h6>{guide.adventure.name}</h6>
                            <span>
                                {guide.user?.userName},{" "}
                                {formatDate(guide.lastModifiedOn)}
                            </span>
                        </div>
                        <ImagePart
                            itemId={guideId}
                            type={0}
                            image={guide.image}
                            onUpdate={onUpdatePhoto}
                        />

                        <GeneralsListPart
                            guide={guide}
                            onUpdate={onUpdatePhoto}
                        />
                    </Col>
                </Col>
            )}
        </Form>
    );
};

export default EditGuide;
