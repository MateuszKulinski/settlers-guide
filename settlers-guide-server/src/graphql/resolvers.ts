import { IResolvers } from "@graphql-tools/utils";
import { AdventureCategory } from "../models/AdventureCategory";
import {
    getAdventureCategories,
    getAdventureCategoryById,
} from "../repo/AdventureCategoryRepo";
import {
    changePassword,
    login,
    logout,
    register,
    UserResult,
} from "../repo/UserRepo";
import { GqlContext } from "./GqlContext";
import { QueryArrayResult, QueryOneResult } from "./QueryArrayResult";

const _STANDARD_ERROR_ = "An error has occurred";

interface EntityResult {
    messages: Array<string>;
}

const isUserExist = (ctx: GqlContext): boolean => {
    if (!ctx.req.session || !ctx.req.session.user?.id) {
        return false;
    }
    return true;
};

const resolvers: IResolvers = {
    AdventureResult: {
        __resolveType(obj: any, context: GqlContext, info: any) {
            console.log(context, info);
            if (obj.messages) {
                return "EntitiResult";
            }
            return "Adventure";
        },
    },
    AdventureCategoryResult: {
        __resolveType(obj: any, context: GqlContext, info: any) {
            console.log(context, info);
            if (obj.messages) {
                return "EntitiResult";
            }
            return "AdventureCategory";
        },
    },
    UserResult: {
        __resolveType(obj: any, context: GqlContext, info: any) {
            console.log(context, info);
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
                throw error;
            }
        },
        //query categories end
    },
    Mutation: {
        //user mutation start
        changePassword: async (
            obj: any,
            args: { newPassword: string; oldPassword: string },
            ctx: GqlContext,
            info: any
        ): Promise<string> => {
            try {
                if (!isUserExist(ctx)) {
                    ("Zaloguj się, aby zmienić hasło");
                }

                const id = ctx.req.session.user?.id;
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
                    ctx.req.session?.user || (ctx.req.session!.user = {});
                    ctx.req.session.user.id = user.user.id;
                    return `Zalogowano użytkownika userId ${
                        ctx.req.session!.user.id
                    }.`;
                }
                return user && user.messages
                    ? user.messages[0]
                    : _STANDARD_ERROR_;
            } catch (error) {
                console.log(error.message);
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
                    console.log("Sesja usunięta", ctx.req.session?.user?.id);
                });
                return result;
            } catch (error) {
                console.log(error.message);
                throw error;
            }
        },
        register: async (
            obj: any,
            args: { email: string; password: string },
            ctx: GqlContext,
            info: any
        ): Promise<string> => {
            let user: UserResult;
            try {
                user = await register(args.email, args.password);
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
        //mutation user end
    },
};

export default resolvers;
