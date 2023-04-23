import React, { FC, useEffect, useState } from "react";
import { Guide } from "../../../../../model/Guide";
import { Button } from "react-bootstrap";
import { gql, useQuery } from "@apollo/client";
import UnitBandit from "../../../../../model/UnitBandit";
import AttackCampEditor from "./AttackCampEditor";

interface AttackListPartProp {
    guide: Guide;
}

const GetBandits = gql`
    query GetBandits {
        getBandits {
            ... on UnitsArray {
                bandits {
                    name
                    id
                }
            }
            ... on EntityResult {
                messages
            }
        }
    }
`;

const GetUnits = gql`
    query GetUnits {
        getUnits {
            ... on UnitsArray {
                units {
                    name
                    id
                }
            }
            ... on EntityResult {
                messages
            }
        }
    }
`;

const AttackListPart: FC<AttackListPartProp> = ({ guide }) => {
    const [show, setShow] = useState<boolean>(true);
    const [content, setContent] = useState<string>("");

    const { data: dataBandits } = useQuery(GetBandits, {
        fetchPolicy: "no-cache",
    });

    const { data: dataUnits } = useQuery(GetUnits, {
        fetchPolicy: "no-cache",
    });
    const [bandits, setBandits] = useState<UnitBandit[]>();
    const [units, setUnits] = useState<UnitBandit[]>();

    useEffect(() => {
        if (dataBandits && dataBandits.getBandits?.bandits) {
            setBandits(dataBandits.getBandits.bandits);
        }
    }, [dataBandits]);

    useEffect(() => {
        if (dataUnits && dataUnits.getUnits?.units) {
            setUnits(dataUnits.getUnits.units);
        }
    }, [dataUnits]);

    return (
        <div id="showHideContainer">
            <div className="showHideTitle">
                <div className="edit-label">Edytuj ataki</div>
                <Button
                    variant="outline-light"
                    className="toggle-button"
                    onClick={() => {
                        setShow(!show);
                    }}
                >
                    {show ? "Ukryj" : "Pokaż"}
                </Button>
            </div>
            <div
                className={`dropZoneContainer hideContainer ${
                    show ? "show" : "hide"
                }`}
            >
                {/* <AttacksListPartItem /> */}
                {bandits && units ? (
                    <AttackCampEditor banditTypes={bandits} unitTypes={units} />
                ) : null}
                {content}
            </div>
        </div>
    );
};

export default AttackListPart;
