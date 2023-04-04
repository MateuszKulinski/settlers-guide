import { gql, useMutation } from "@apollo/client";

const SaveGuideGQL = gql`
    mutation SaveGuide($guideId: ID!, $description: String, $type: Int) {
        saveGuide(guideId: $guideId, description: $description, type: $type) {
            ... on EntityResult {
                messages
            }
            ... on BooleanResult {
                data
            }
        }
    }
`;

const useUpdateGuide = () => {
    const [execSaveGuide] = useMutation(SaveGuideGQL);

    const updateGuide = async (
        guideId: string,
        description?: string,
        type?: number
    ) => {
        return await execSaveGuide({
            variables: {
                guideId,
                description: description,
                type: type,
            },
        });
    };

    return updateGuide;
};

export default useUpdateGuide;
