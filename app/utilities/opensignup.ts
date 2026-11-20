import { createSearchParams } from "react-router-dom";

export const openSignUp = (navigate) => {

    const newParams = createSearchParams({
        fromLanding: true,
    });
    
    navigate({
        pathname: '/test-signup',
        search: `?${newParams.toString()}`
    });
};