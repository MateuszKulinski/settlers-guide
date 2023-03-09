import { gql, useQuery } from "@apollo/client";
import React, { FC } from "react";
import { _API_VERSION_, _SERVER_URL_ } from "../../../assets/consts";
import General from "../../../model/General";
import GeneralUpgrade from "../../../model/GeneralUpgrade";
import GeneralUpgradeType from "../../../model/GeneralUpgradeType";
import { GeneralUpgradeTypeItemInterface } from "./EditGeneral";
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
    generalUpgrades: [GeneralUpgrade] | undefined;
}

const UpgradeTypesTree: FC<UpgradeTypesTreeProps> = ({
    sendOutUpgradeItem,
    generalUpgrades,
}) => {
    const { data: dataGeneralUpgradeTypes } = useQuery(GetGeneralUpgradeTypes);

    return (
        <>
            {dataGeneralUpgradeTypes && (
                <div className="upgradeContainer">
                    {dataGeneralUpgradeTypes.getGeneralUpgradeTypes.map(
                        (generalUpgradeType: GeneralUpgradeType) => {
                            const value = generalUpgrades
                                ? generalUpgrades.reduce(
                                      (accumulator, item) => {
                                          if (
                                              item.upgradeType.id ===
                                              generalUpgradeType.id
                                          ) {
                                              return item.level;
                                          }
                                          return accumulator;
                                      },
                                      0
                                  )
                                : 0;
                            return (
                                <GeneralUpgradeTypeItem
                                    key={generalUpgradeType.id}
                                    generalUpgradeType={generalUpgradeType}
                                    sendOutUpgradeItem={sendOutUpgradeItem}
                                    startValue={value}
                                />
                            );
                        }
                    )}
                </div>
            )}
        </>
    );
};

export default UpgradeTypesTree;
