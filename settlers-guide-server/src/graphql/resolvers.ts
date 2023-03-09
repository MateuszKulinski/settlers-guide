import { AdventureCategory } from "../models/AdventureCategory";
import { GqlContext } from "./GqlContext";
import { IResolvers } from "@graphql-tools/utils";
import { QueryArrayResult, QueryOneResult } from "./QueryArrayResult";
import {
    changePassword,
    login,
    logout,
    me,
    register,
    UserResult,
} from "../repo/UserRepo";
import {
    getAdventureCategories,
    getAdventureCategoryById,
} from "../repo/AdventureCategoryRepo";
import { User } from "../models/User";
import { GeneralType } from "../models/GeneralType";
import { getGeneralTypes } from "../repo/GeneralTypeRepo";
import { getGeneralUpgradeTypes } from "../repo/GeneralUpgradeTypeRepo";
import { GeneralUpgradeType } from "../models/GeneralUpgradeType";
import { createGeneral, getGenerals } from "../repo/GeneralRepo";
import { createGeneralUpgrade } from "../repo/GeneralUpgradeRepo";
import { General } from "../models/General";

const _STANDARD_ERROR_ = "An error has occurred";

interface EntityResult {
    messages: Array<string>;
}

const resolvers: IResolvers = {
    AdventureResult: {
        __resolveType(obj: any, context: GqlContext, info: any) {
            if (obj.messages) {
                return "EntitiResult";
            }
            return "Adventure";
        },
    },
    AdventureCategoryResult: {
        __resolveType(obj: any, context: GqlContext, info: any) {
            if (obj.messages) {
                return "EntitiResult";
            }
            return "AdventureCategory";
        },
    },
    GeneralTypeResult: {
        __resolveType(obj: any, context: GqlContext, info: any) {
            if (obj.messages) {
                return "EntitiResult";
            }
            return "GeneralType";
        },
    },
    GeneralUpgradeTypeResult: {
        __resolveType(obj: any, context: GqlContext, info: any) {
            if (obj.messages) {
                return "EntitiResult";
            }
            return "GeneralUpgradeType";
        },
    },
    UserResult: {
        __resolveType(obj: any, context: GqlContext, info: any) {
            if (obj.messages) {
                return "EntityResult";
            }
            return "User";
        },
    },
    GeneralResult: {
        __resolveType(obj: any, context: GqlContext, info: any) {
            if (obj.messages) {
                return "EntityResult";
            }
            return "General";
        },
    },
    Query: {
        //query categories start
        getAdventureCategory: async (
            obj: any,
            args: { id: string },
            ctx: GqlContext,
            info: any
        ): Promise<AdventureCategory | EntityResult> => {
            let adventureCategory: QueryOneResult<AdventureCategory>;
            try {
                adventureCategory = await getAdventureCategoryById(args.id);
                if (adventureCategory.entity) {
                    return adventureCategory.entity;
                }
                return {
                    messages: adventureCategory.messages
                        ? adventureCategory.messages
                        : [_STANDARD_ERROR_],
                };
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        getAdventureCategories: async (
            obj: any,
            args: { id: string },
            ctx: GqlContext,
            info: any
        ): Promise<Array<AdventureCategory> | EntityResult> => {
            let adventureCategories: QueryArrayResult<AdventureCategory>;
            try {
                adventureCategories = await getAdventureCategories();
                if (adventureCategories.entities) {
                    return adventureCategories.entities;
                }

                return {
                    messages: adventureCategories.messages
                        ? adventureCategories.messages
                        : [_STANDARD_ERROR_],
                };
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        //query categories end
        //query generals start
        getGenerals: async (
            obj: any,
            args: { id: string },
            ctx: GqlContext,
            info: any
        ): Promise<Array<General> | EntityResult> => {
            let generals: QueryArrayResult<General>;
            try {
                if (!ctx.req.session?.userId) {
                    return { messages: ["Użytkownik nie jest zalogowany"] };
                }

                generals = await getGenerals(args.id, ctx.req.session?.userId);

                if (generals.entities) {
                    return generals.entities;
                }

                return {
                    messages: generals.messages
                        ? generals.messages
                        : [_STANDARD_ERROR_],
                };
            } catch (error) {
                console.log(error);
                throw error;
            }
        },

        getGeneralTypes: async (
            obj: any,
            args: { id: string },
            ctx: GqlContext,
            info: any
        ): Promise<Array<GeneralType> | EntityResult> => {
            let generalTypes: QueryArrayResult<GeneralType>;
            try {
                generalTypes = await getGeneralTypes();
                if (generalTypes.entities) {
                    return generalTypes.entities;
                }
                return {
                    messages: generalTypes.messages
                        ? generalTypes.messages
                        : [_STANDARD_ERROR_],
                };
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        getGeneralUpgradeTypes: async (
            obj: any,
            args: { id: string },
            ctx: GqlContext,
            info: any
        ): Promise<Array<GeneralUpgradeType> | EntityResult> => {
            let generalUpgradeTypes: QueryArrayResult<GeneralUpgradeType>;
            try {
                generalUpgradeTypes = await getGeneralUpgradeTypes();
                if (generalUpgradeTypes.entities) {
                    return generalUpgradeTypes.entities;
                }
                return {
                    messages: generalUpgradeTypes.messages
                        ? generalUpgradeTypes.messages
                        : [_STANDARD_ERROR_],
                };
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        //query generals end
        //query user start
        me: async (
            obj: any,
            args: null,
            ctx: GqlContext,
            info: any
        ): Promise<User | EntityResult> => {
            let user: UserResult;
            try {
                if (!ctx.req.session?.userId) {
                    return { messages: ["Użytkownik nie jest zalogowany"] };
                }

                user = await me(ctx.req.session?.userId);
                if (user && user.user) {
                    return user.user;
                }
                return {
                    messages: user.messages
                        ? user.messages
                        : [_STANDARD_ERROR_],
                };
            } catch (error) {
                throw error;
            }
        },
        //query user end
    },
    Mutation: {
        //mutation general start
        createGeneral: async (
            obj: any,
            args: {
                name: string;
                generalType: string;
                upgrades: Array<{
                    level: number;
                    upgradeType: string;
                }>;
            },
            ctx: GqlContext,
            info: any
        ): Promise<string> => {
            try {
                if (!ctx.req.session || !ctx.req.session!.userId) {
                    return "Aby zmienić hasło, musisz się najpierw zalogować.";
                }

                const userId = ctx.req.session!.userId;
                const general = await createGeneral(
                    userId,
                    args.name,
                    args.generalType
                );
                if (general.messages) return general.messages[0];
                if (!general.entity) return _STANDARD_ERROR_;

                const { upgrades } = args;
                if (upgrades.length) {
                    await Promise.all(
                        upgrades.map(async (item) => {
                            const { level, upgradeType } = item;
                            if (general.entity) {
                                await createGeneralUpgrade(
                                    level,
                                    upgradeType,
                                    general.entity
                                );
                            }
                        })
                    );
                }
                return general.entity.id;
            } catch (error) {
                console.log(error.message);
                throw error;
            }
        },
        //mutation general end
        //mutation user start
        changePassword: async (
            obj: any,
            args: { newPassword: string; oldPassword: string },
            ctx: GqlContext,
            info: any
        ): Promise<string> => {
            try {
                if (!ctx.req.session || !ctx.req.session!.userId) {
                    return "Aby zmienić hasło, musisz się najpierw zalogować.";
                }

                const id = ctx.req.session!.userId;
                let result = await changePassword(
                    id,
                    args.newPassword,
                    args.oldPassword
                );

                return result;
            } catch (error) {
                console.log(error.message);
                throw error;
            }
        },
        login: async (
            obj: any,
            args: { email: string; password: string },
            ctx: GqlContext,
            info: any
        ): Promise<string> => {
            let user: UserResult;
            try {
                user = await login(args.email, args.password);
                if (user && user.user) {
                    ctx.req.session!.userId = user.user.id;
                    return `Zalogowano użytkownika`;
                }
                return user && user.messages
                    ? user.messages[0]
                    : _STANDARD_ERROR_;
            } catch (error) {
                throw error;
            }
        },
        logout: async (
            obj: any,
            args: { email: string },
            ctx: GqlContext,
            info: any
        ): Promise<string> => {
            try {
                let result = await logout(args.email);
                ctx.req.session?.destroy((err: any) => {
                    if (err) {
                        console.log("Problem z usunięciem sesji");
                        return;
                    }
                    console.log("Sesja usunięta");
                });
                return result;
            } catch (error) {
                console.log(error.message);
                throw error;
            }
        },
        register: async (
            obj: any,
            args: {
                email: string;
                password: string;
                passwordConfirmation: string;
                userName: string;
            },
            ctx: GqlContext,
            info: any
        ): Promise<string> => {
            let user: UserResult;
            try {
                user = await register(
                    args.email,
                    args.password,
                    args.passwordConfirmation,
                    args.userName
                );
                if (user && user.user) {
                    return "Zarejestrowano użytkownika";
                }

                return user && user.messages
                    ? user.messages[0]
                    : _STANDARD_ERROR_;
            } catch (error) {
                console.log(error.message);
                throw error;
            }
        },
        //user mutation end
    },
};

export default resolvers;
