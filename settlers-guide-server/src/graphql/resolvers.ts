import { IResolvers } from "@graphql-tools/utils";
import { AdventureCategory } from "../models/AdventureCategory";
import {
    getAdventureCategories,
    getAdventureCategoryById,
} from "../repo/AdventureCategoryRepo";
import { login, logout, register, UserResult } from "../repo/UserRepo";
import { GqlContext } from "./GqlContext";
import { QueryArrayResult, QueryOneResult } from "./QueryArrayResult";

const _STANDARD_ERROR_ = "An error has occurred";

interface EntityResult {
    messages: Array<string>;
}

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

        // me: async (
        //     obj: any,
        //     args: null,
        //     ctx: GqlContext,
        //     info: any
        // ): Promise<User | EntityResult> => {
        //     let user: UserResult;
        //     try {
        //         if (!ctx.req.session?.userId) {
        //             return {
        //                 messages: ["User not logged in"],
        //             };
        //         }
        //         user = await me(ctx.req.session.userId);
        //         if (user && user.user) {
        //             return user.user;
        //         }
        //         return {
        //             messages: user.messages
        //                 ? user.messages
        //                 : [_STANDARD_ERROR_],
        //         };
        //     } catch (error) {
        //         throw error;
        //     }
        // },
    },
    Mutation: {
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
                    ctx.req.session!.user || (ctx.req.session!.user = {});
                    ctx.req.session.user.id = user.user.id;
                    return `Login successful for userId ${
                        ctx.req.session!.user.id
                    }.`;
                }
                return user && user.messages
                    ? user.messages[0]
                    : _STANDARD_ERROR_;
            } catch (ex) {
                console.log(ex.message);
                throw ex;
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
                        console.log("destroy session failed");
                        return;
                    }
                    console.log("session destroyed", ctx.req.session?.user?.id);
                });
                return result;
            } catch (ex) {
                throw ex;
            }
        },
    },
};

export default resolvers;
