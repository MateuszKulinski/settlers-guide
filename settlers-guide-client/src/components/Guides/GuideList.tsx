import { gql, useMutation, useQuery } from "@apollo/client";
import React, { FC, useEffect, useState } from "react";
import { Button, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
    _CLASS_PADDING_,
    _CLASS_YELLOW_CONTAINER_,
    _URL_NEW_GENERAL_,
    _URL_NEW_GUIDE_,
} from "../../assets/consts";
import { Guide } from "../../model/Guide";
import Loader from "../Loader/Loader";
import GuidesListItem from "./GuideListItem/GuidesListItem";

const DeleteGuide = gql`
    mutation DeleteGuide($guideId: ID!) {
        deleteGuide(guideId: $guideId)
    }
`;

const GetMyGuides = gql`
    query Guides {
        getGuides {
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
                }
            }
        }
    }
`;

const GuideList: FC = () => {
    const { data: dataGuides } = useQuery(GetMyGuides, {
        fetchPolicy: "no-cache",
    });
    const [execDeleteGuide] = useMutation(DeleteGuide);
    const [content, setContent] = useState<React.ReactNode>(<Loader />);
    const [guides, setGuides] = useState<Guide[]>([]);

    useEffect(() => {
        if (dataGuides && dataGuides.getGuides.guides) {
            setGuides(dataGuides.getGuides.guides);
        }
    }, [dataGuides]);

    useEffect(() => {
        changeContent(guides);
    }, [guides]);

    const onDelete = async (guideId: string) => {
        setContent(<Loader />);
        const { data: removedGuide } = await execDeleteGuide({
            variables: { guideId: guideId },
        });

        if (removedGuide.deleteGuide === true) {
            const newGenerals = guides.filter(
                (guide: Guide) => guide.id !== guideId
            );
            setGuides(newGenerals);
        } else {
            changeContent(guides);
        }
    };

    const changeContent = (guides: Guide[]) => {
        let newContent: React.ReactNode = (
            <h5 className="emptyError">Brak poradników</h5>
        );
        if (guides && guides.length > 0) {
            newContent = guides.map((guide: Guide) => (
                <GuidesListItem
                    key={guide.id}
                    guide={guide}
                    onDelete={onDelete}
                />
            ));
        }
        setContent(newContent);
    };

    return (
        <Col
            className={`${_CLASS_YELLOW_CONTAINER_} offset-md-3`}
            md={6}
            xs={12}
        >
            <Col xs={12} className={_CLASS_PADDING_}>
                <Link to={_URL_NEW_GUIDE_}>
                    <Button variant="success">Dodaj poradnik</Button>
                </Link>
                {content}
            </Col>
        </Col>
    );
};

export default GuideList;
