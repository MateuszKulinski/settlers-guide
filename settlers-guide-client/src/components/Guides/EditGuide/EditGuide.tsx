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
import GeneralsListPart from "./parts/generals/GeneralsListPart";
import GuideType from "../GuideType";
import GuideDescription from "../GuideDescription";
import AttackListPart from "./parts/attacks/AttacksListPart";
import General from "../../../model/General";

const GetMyGenerals = gql`
    query General($withPublic: Boolean) {
        getGenerals(withPublic: $withPublic) {
            ... on EntityResult {
                messages
            }
            ... on GeneralArray {
                generals {
                    name
                    id
                    generalType {
                        id
                        name
                    }
                    upgrades {
                        level
                        id
                        upgradeType {
                            name
                            id
                        }
                    }
                }
            }
        }
    }
`;

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
                    type
                    description
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
                    attacks {
                        army
                        camp
                        garrison
                        description
                        id
                        opponents
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
    const { data: dataGenerals } = useQuery(GetMyGenerals, {
        fetchPolicy: "no-cache",
        variables: {
            withPublic: true,
        },
    });
    const [guide, setGuide] = useState<Guide>();
    const [generals, setGenerals] = useState<General[]>([]);

    useEffect(() => {
        if (dataGenerals && dataGenerals.getGenerals.generals) {
            setGenerals(dataGenerals.getGenerals.generals);
        }
    }, [dataGenerals]);

    useEffect(() => {
        if (dataGuides && dataGuides.getGuides.guides) {
            console.log(dataGuides.getGuides.guides[0]);
            setGuide(
                dataGuides.getGuides.guides[0]
                    ? dataGuides.getGuides.guides[0]
                    : null
            );
        }
    }, [dataGuides]);

    const refetchGuide = () => {
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
                        <GuideDescription
                            value={guide.description}
                            guideId={guideId}
                            onChange={refetchGuide}
                        />
                        <GuideType startValue={guide.type} guideId={guideId} />
                        <ImagePart
                            itemId={guideId}
                            type={0}
                            image={guide.image}
                            onUpdate={refetchGuide}
                        />

                        <GeneralsListPart
                            guide={guide}
                            generals={generals}
                            onUpdate={refetchGuide}
                        />

                        <AttackListPart guide={guide} generals={generals} />
                    </Col>
                </Col>
            )}
        </Form>
    );
};

export default EditGuide;
