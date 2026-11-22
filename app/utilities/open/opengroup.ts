import { createSearchParams } from "react-router-dom";

export const openGroup = (group_id: any, navigate: any) => {

    const newParams = createSearchParams({
        id: group_id
    });
    
    navigate({
        pathname: '/test-group',
        search: `?${newParams.toString()}`
    });
};