import { gql, useQuery } from "@apollo/client";
import { FC, useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { _CLASS_PADDING_, _CLASS_YELLOW_CONTAINER_ } from "../../assets/consts";
import General from "../../model/General";
import Loader from "../Loader/Loader";
import GeneralsListItem from "./GeneralsListItem";

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
    const { data: dataGenerals } = useQuery(GetMyGenerals);
    const [content, setContent] = useState(<Loader />);

    useEffect(() => {
        console.log(dataGenerals);
        if (dataGenerals && dataGenerals.getGenerals) {
            console.log(dataGenerals.getGenerals);
            const newContent = dataGenerals.getGenerals.map(
                (general: General) => (
                    <GeneralsListItem key={general.id} general={general} />
                )
            );
            setContent(newContent);
        }
    }, [dataGenerals]);

    return (
        <>
            <Col
                className={`${_CLASS_YELLOW_CONTAINER_} offset-md-3`}
                md={6}
                xs={12}
            >
                <Col xs={12} className={_CLASS_PADDING_}>
                    {content}
                </Col>
            </Col>
        </>
    );
};

export default GeneralsList;
