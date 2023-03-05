import { gql, QueryLazyOptions, useLazyQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { UserProfileSetType } from "../store/user/Reducer";

export const Me = gql`
    query me {
        me {
            ... on EntityResult {
                messages
            }
            ... on User {
                id
                userName
            }
        }
    }
`;

interface UseRefreshMeResult {
    execMe: (
        options?: QueryLazyOptions<Record<string, any>> | undefined
    ) => void;
    deleteMe: () => void;
}

const useRefreshMe = (login: boolean): UseRefreshMeResult => {
    const [execMe, { called, loading, data }] = useLazyQuery(Me);
    const reduxDispatcher = useDispatch();

    const updateMe = () => {
        if (data && !loading && data.me && data.me.userName) {
            reduxDispatcher({
                type: UserProfileSetType,
                payload: data.me,
            });
        }
    };

    const deleteMe = () => {
        reduxDispatcher({
            type: UserProfileSetType,
            payload: null,
        });
    };

    login && updateMe();
    return { execMe, deleteMe };
    // return { execMe };
};

export default useRefreshMe;
