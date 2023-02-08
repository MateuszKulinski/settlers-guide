import { IResolvers } from "@graphql-tools/utils";
// import { User } from "../models/User";
// import { me, UserResult } from "../repo/UserRepo";
import { GqlContext } from "./GqlContext";

// const _STANDARD_ERROR_ = "An error has occurred";

// interface EntityResult {
//     messages: Array<string>;
// }

const resolvers: IResolvers = {
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
};

export default resolvers;
