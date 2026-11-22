import { createSearchParams } from "react-router-dom";

export const openProfile = (user_id: any, navigate: any) => {

    const newParams = createSearchParams({
        id: user_id
    });
    
    navigate({
        pathname: '/test-profile',
        search: `?${newParams.toString()}`
    });
};