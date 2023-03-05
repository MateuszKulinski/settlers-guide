import { gql, useQuery } from "@apollo/client";
import React, { FC } from "react";
import { _API_VERSION_, _SERVER_URL_ } from "../../../assets/consts";
import GeneralUpgradeType from "../../../model/GeneralUpgradeType";
import { GeneralUpgradeTypeItemInterface } from "./AddGeberal";
import "./UpgradeTypesTree.css";
import GeneralUpgradeTypeItem from "./UpgradeTypesTreeItem";

const GetGeneralUpgradeTypes = gql`
    query GetGeneralUpgradeTypes {
        getGeneralUpgradeTypes {
            ... on EntityResult {
                messages
            }
            ... on GeneralUpgradeType {
                id
                name
            }
        }
    }
`;

interface UpgradeTypesTreeProps {
    sendOutUpgradeItem: (item: GeneralUpgradeTypeItemInterface) => void;
}

const UpgradeTypesTree: FC<UpgradeTypesTreeProps> = ({
    sendOutUpgradeItem,
}) => {
    const { data: dataGeneralUpgradeTypes } = useQuery(GetGeneralUpgradeTypes);

    return (
        <>
            {dataGeneralUpgradeTypes && (
                <div className="upgradeContainer">
                    {dataGeneralUpgradeTypes.getGeneralUpgradeTypes.map(
                        (generalUpgradeType: GeneralUpgradeType) => (
                            <GeneralUpgradeTypeItem
                                key={generalUpgradeType.id}
                                generalUpgradeType={generalUpgradeType}
                                sendOutUpgradeItem={sendOutUpgradeItem}
                            />
                        )
                    )}
                </div>
            )}
        </>
    );
};

export default UpgradeTypesTree;
