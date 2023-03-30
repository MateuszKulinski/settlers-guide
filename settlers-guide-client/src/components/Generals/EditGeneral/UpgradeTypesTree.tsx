import { gql, useQuery } from "@apollo/client";
import React, { FC, useEffect, useState } from "react";
import { _API_VERSION_, _SERVER_URL_ } from "../../../assets/consts";
import General from "../../../model/General";
import GeneralUpgrade from "../../../model/GeneralUpgrade";
import GeneralUpgradeType from "../../../model/GeneralUpgradeType";
import Loader from "../../Loader/Loader";
import { GeneralUpgradeTypeItemInterface } from "./EditGeneral";
import "./UpgradeTypesTree.css";
import GeneralUpgradeTypeItem from "./UpgradeTypesTreeItem";

const GetGeneralUpgradeTypes = gql`
    query EntityResult {
        getGeneralUpgradeTypes {
            ... on EntityResult {
                messages
            }
            ... on GeneralUpgradeArrayType {
                upgradeTypes {
                    name
                    id
                }
            }
        }
    }
`;

interface UpgradeTypesTreeProps {
    sendOutUpgradeItem: (item: GeneralUpgradeTypeItemInterface) => void;
    generalUpgrades?: [GeneralUpgrade] | undefined;
}

const UpgradeTypesTree: FC<UpgradeTypesTreeProps> = ({
    sendOutUpgradeItem,
    generalUpgrades,
}) => {
    const { data: dataGeneralUpgradeTypes } = useQuery(GetGeneralUpgradeTypes);
    const [content, setContent] = useState(<Loader />);
    useEffect(() => {
        if (
            dataGeneralUpgradeTypes &&
            dataGeneralUpgradeTypes.getGeneralUpgradeTypes.upgradeTypes
        ) {
            const newContent =
                dataGeneralUpgradeTypes.getGeneralUpgradeTypes.upgradeTypes.map(
                    (generalUpgradeType: GeneralUpgradeType) => {
                        const value = generalUpgrades
                            ? generalUpgrades.reduce((accumulator, item) => {
                                  if (
                                      item.upgradeType.id ===
                                      generalUpgradeType.id
                                  ) {
                                      return item.level;
                                  }
                                  return accumulator;
                              }, 0)
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
                );
            setContent(newContent);
        }
    }, [dataGeneralUpgradeTypes]);

    return (
        <>
            {dataGeneralUpgradeTypes && (
                <div className="upgradeContainer">{content}</div>
            )}
        </>
    );
};

export default UpgradeTypesTree;
