import { gql, useMutation, useQuery } from "@apollo/client";
import { FC, useEffect, useState } from "react";
import { Button, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
    _CLASS_PADDING_,
    _CLASS_YELLOW_CONTAINER_,
    _URL_NEW_GENERAL_,
} from "../../assets/consts";
import General from "../../model/General";
import Loader from "../Loader/Loader";
import GeneralsListItem from "./GeneralsListItem";

const DeleteGeneral = gql`
    mutation DeleteGeneral($generalId: ID!) {
        deleteGeneral(generalId: $generalId)
    }
`;

const GetMyGenerals = gql`
    query General {
        getGenerals {
            ... on General {
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
`;

const GeneralsList: FC = () => {
    const { data: dataGenerals } = useQuery(GetMyGenerals, {
        fetchPolicy: "no-cache",
    });
    const [execDeleteGeneral] = useMutation(DeleteGeneral);
    const [content, setContent] = useState<React.ReactNode>(<Loader />);
    const [generals, setGenerals] = useState<General[]>([]);

    const onDelete = async (generalId: string) => {
        setContent(<Loader />);
        const { data: removedGeneral } = await execDeleteGeneral({
            variables: { generalId: generalId },
        });

        if (removedGeneral.deleteGeneral === true) {
            const newGenerals = generals.filter(
                (general: General) => general.id !== generalId
            );
            setGenerals(newGenerals);
        } else {
            changeContent(generals);
        }
    };

    useEffect(() => {
        if (dataGenerals && dataGenerals.getGenerals) {
            setGenerals(dataGenerals.getGenerals);
        }
    }, [dataGenerals]);

    useEffect(() => {
        if (generals && generals.length > 0) {
            changeContent(generals);
        }
    }, [generals]);

    const changeContent = (generals: General[]) => {
        const newContent = generals.map((general: General) => (
            <GeneralsListItem
                key={general.id}
                general={general}
                onDelete={onDelete}
            />
        ));
        setContent(newContent);
    };

    return (
        <>
            <Col
                className={`${_CLASS_YELLOW_CONTAINER_} offset-md-3`}
                md={6}
                xs={12}
            >
                <Col xs={12} className={_CLASS_PADDING_}>
                    <Link to={_URL_NEW_GENERAL_}>
                        <Button variant="success">Dodaj generała</Button>
                    </Link>
                    {content}
                </Col>
            </Col>
        </>
    );
};

export default GeneralsList;
