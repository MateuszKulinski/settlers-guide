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
import { saveGeneral, getGenerals, deleteGeneral } from "../repo/GeneralRepo";
import { saveGeneralUpgrade } from "../repo/GeneralUpgradeRepo";
import { General } from "../models/General";
import {
    addGuide,
    deleteGuide,
    getGuides,
    saveGuideGeneral,
    // saveGuideGeneral,
} from "../repo/GuideRepo";
import { Guide } from "../models/Guide";
import { joinItemImage, removeImage } from "../repo/ImageRepo";

const _STANDARD_ERROR_ = "An error has occurred";

interface EntityResult {
    messages: Array<string>;
}

const resolvers: IResolvers = {
    AdventureResult: {
        __resolveType(obj: any, context: GqlContext, info: any) {
            if (obj.messages) {
                return "EntityResult";
            }
            return "Adventure";
        },
    },
    AdventureCategoryResult: {
        __resolveType(obj: any, context: GqlContext, info: any) {
            if (obj.messages) {
                return "EntityResult";
            }
            return "AdventureCategory";
        },
    },
    AdventureCategoryArrayResult: {
        __resolveType(obj: any, context: GqlContext, info: any) {
            if (obj.messages) {
                return "EntityResult";
            }
            return "AdventureCategoryArray";
        },
    },
    SaveResult: {
        __resolveType(obj: any, context: GqlContext, info: any) {
            if (obj.message) {
                return "EntityResult";
            }
            return "BooleanResult";
        },
    },
    GeneralArrayResult: {
        __resolveType(obj: any, context: GqlContext, info: any) {
            if (obj.messages) {
                return "EntityResult";
            }
            return "GeneralArray";
        },
    },
    GeneralTypeArrayResult: {
        __resolveType(obj: any, context: GqlContext, info: any) {
            if (obj.messages) {
                return "EntityResult";
            }
            return "GeneralTypeArray";
        },
    },
    GeneralUpgradeTypeArrayResult: {
        __resolveType(obj: any, context: GqlContext, info: any) {
            if (obj.messages) {
                return "EntityResult";
            }
            return "GeneralUpgradeArrayType";
        },
    },
    GuideArrayResult: {
        __resolveType(obj: any, context: GqlContext, info: any) {
            if (obj.messages) {
                return "EntityResult";
            }
            return "GuideArray";
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
        ): Promise<{ categories: Array<AdventureCategory> } | EntityResult> => {
            let adventureCategories: QueryArrayResult<AdventureCategory>;
            try {
                adventureCategories = await getAdventureCategories();
                if (adventureCategories.entities) {
                    return { categories: adventureCategories.entities };
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
            args: { id: string; withPublic: boolean },
            ctx: GqlContext,
            info: any
        ): Promise<{ generals: Array<General> } | EntityResult> => {
            let generals: QueryArrayResult<General>;
            try {
                if (!ctx.req.session?.userId) {
                    return { messages: ["Użytkownik nie jest zalogowany"] };
                }

                generals = await getGenerals(
                    args.id,
                    ctx.req.session?.userId,
                    args.withPublic
                );

                if (generals.entities) {
                    return {
                        generals: generals.entities,
                    };
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
        ): Promise<{ types: Array<GeneralType> } | EntityResult> => {
            let generalTypes: QueryArrayResult<GeneralType>;
            try {
                generalTypes = await getGeneralTypes();
                if (generalTypes.entities) {
                    return { types: generalTypes.entities };
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
        ): Promise<
            { upgradeTypes: Array<GeneralUpgradeType> } | EntityResult
        > => {
            let generalUpgradeTypes: QueryArrayResult<GeneralUpgradeType>;
            try {
                generalUpgradeTypes = await getGeneralUpgradeTypes();
                if (generalUpgradeTypes.entities) {
                    return { upgradeTypes: generalUpgradeTypes.entities };
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
        //query guide start
        getGuides: async (
            obj: any,
            args: { id: string },
            ctx: GqlContext,
            info: any
        ): Promise<{ guides: Array<Guide> } | EntityResult> => {
            let guides: QueryArrayResult<Guide>;
            try {
                if (!ctx.req.session?.userId) {
                    return { messages: ["Użytkownik nie jest zalogowany"] };
                }

                guides = await getGuides(args.id, ctx.req.session!.userId);
                if (guides.entities) {
                    return {
                        guides: guides.entities,
                    };
                }

                return {
                    messages: guides.messages
                        ? guides.messages
                        : [_STANDARD_ERROR_],
                };
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        //query guide end
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
        saveGeneral: async (
            obj: any,
            args: {
                generalId: string | undefined;
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
                    return "Zaloguj się przed dodaniem.";
                }

                const userId = ctx.req.session!.userId;
                const general = await saveGeneral(
                    userId,
                    args.generalId,
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
                                await saveGeneralUpgrade(
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
        deleteGeneral: async (
            obj: any,
            args: { generalId: string },
            ctx: GqlContext,
            info: any
        ): Promise<boolean> => {
            try {
                if (!ctx.req.session || !ctx.req.session!.userId) {
                    return false;
                }

                return deleteGeneral(args.generalId, ctx.req.session!.userId);
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        //mutation general end
        //mutation guides start
        addGuide: async (
            obj: any,
            args: {
                name: string;
                description: string;
                type: number;
                adventureId: string;
            },
            ctx: GqlContext,
            info: any
        ): Promise<string> => {
            try {
                if (!ctx.req.session || !ctx.req.session!.userId) {
                    return "Zaloguj się przed dodaniem.";
                }

                const userId = ctx.req.session!.userId;
                const guide = await addGuide(
                    userId,
                    args.name,
                    args.description,
                    args.type,
                    args.adventureId
                );
                if (guide.messages) return guide.messages[0];
                if (!guide.entity) return _STANDARD_ERROR_;

                return guide.entity.id;
            } catch (error) {
                console.log(error.message);
                throw error;
            }
        },
        deleteGuide: async (
            obj: any,
            args: { guideId: string },
            ctx: GqlContext,
            info: any
        ): Promise<boolean> => {
            try {
                if (!ctx.req.session || !ctx.req.session!.userId) {
                    return false;
                }

                return deleteGuide(args.guideId, ctx.req.session!.userId);
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        changeGuideGeneral: async (
            obj: any,
            args: { generalId: string; guideId: string; checked: boolean },
            ctx: GqlContext,
            info: any
        ): Promise<{ data: boolean } | EntityResult> => {
            try {
                if (!ctx.req.session?.userId) {
                    return { messages: ["Użytkownik nie jest zalogowany"] };
                }

                const saveGuideGeneralResult = await saveGuideGeneral(
                    args.generalId,
                    args.guideId,
                    args.checked,
                    ctx.req.session!.userId
                );

                if (saveGuideGeneralResult.entity) {
                    return { data: saveGuideGeneralResult.entity };
                }

                return {
                    messages: saveGuideGeneralResult.messages
                        ? saveGuideGeneralResult.messages
                        : [_STANDARD_ERROR_],
                };
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        //mutation guides end
        //mutation image start
        joinItemImage: async (
            obj: any,
            args: { type: number; itemId: string; imgId: string },
            ctx: GqlContext,
            info: any
        ): Promise<boolean> => {
            try {
                if (!ctx.req.session || !ctx.req.session!.userId) {
                    return false;
                }

                return joinItemImage(
                    args.type,
                    args.itemId,
                    args.imgId,
                    ctx.req.session.userId
                );
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        removeImage: async (
            obj: any,
            args: { type: number; itemId: string; imgId: string },
            ctx: GqlContext,
            info: any
        ): Promise<boolean> => {
            try {
                if (!ctx.req.session || !ctx.req.session!.userId) {
                    return false;
                }

                return removeImage(
                    args.type,
                    args.itemId,
                    args.imgId,
                    ctx.req.session.userId
                );
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        //mutation image end
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
                return await changePassword(
                    id,
                    args.newPassword,
                    args.oldPassword
                );
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
