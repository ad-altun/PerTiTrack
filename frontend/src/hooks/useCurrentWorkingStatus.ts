import { useGetCurrentStatusQuery } from "../store/api/timetrackApi.ts";


export const useCurrentWorkingStatus = () => {

    const {
        data: currentStatus,
        isLoading: isCurrentStatusLoading,
        error: currentStatusError
    } = useGetCurrentStatusQuery();

    return {
        currentStatus,
        isCurrentStatusLoading,
        currentStatusError
    };

}