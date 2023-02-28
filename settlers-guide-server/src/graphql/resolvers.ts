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
