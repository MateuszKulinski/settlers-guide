import React, { FC, useEffect, useState } from "react";
import { Guide } from "../../../../../model/Guide";
import { Button } from "react-bootstrap";
import { gql, useQuery } from "@apollo/client";
import UnitBandit from "../../../../../model/UnitBandit";
import AttackCampEditor from "./AttackCampEditor";
import General from "../../../../../model/General";
import GuideCampView from "../../../ViewGuide/GuideCampView";
import GuideCamp from "../../../../../model/GuideCamp";

interface AttackListPartProp {
    guide: Guide;
    generals: General[];
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

const AttackListPart: FC<AttackListPartProp> = ({ guide, generals }) => {
    const [show, setShow] = useState<boolean>(true);

    const { data: dataBandits } = useQuery(GetBandits, {
        fetchPolicy: "no-cache",
    });

    const { data: dataUnits } = useQuery(GetUnits, {
        fetchPolicy: "no-cache",
    });
    const [bandits, setBandits] = useState<UnitBandit[]>();
    const [units, setUnits] = useState<UnitBandit[]>();
    const [campsContent, setCampsContent] = useState<React.ReactNode>(<></>);
    const [active, setActive] = useState<number>(0);

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

    useEffect(() => {
        if (bandits && units && guide.id && guide.attacks) {
            const content = guide.attacks.map((attack: GuideCamp) => (
                <GuideCampView key={guide.id} attack={attack} />
                // <AttackCampEditor
                //     key={guide.id}
                //     guideId={guide.id as string}
                //     generals={generals}
                //     banditTypes={bandits}
                //     unitTypes={units}
                //     attack={attack}
                // />
            ));
            if (content) setCampsContent(content);
        }
    }, [bandits, units]);

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
                {campsContent}
                {bandits && units && guide.id ? (
                    <AttackCampEditor
                        guideId={guide.id}
                        generals={generals}
                        banditTypes={bandits}
                        unitTypes={units}
                    />
                ) : null}
            </div>
        </div>
    );
};

export default AttackListPart;
