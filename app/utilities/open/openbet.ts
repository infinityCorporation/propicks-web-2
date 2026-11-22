import { createSearchParams } from 'react-router';

export const openBet = async (search: any, navigate: any) => {
    const newParams = createSearchParams({
        search: search
    });

    navigate({
        pathname: "/test-scanner",
        search: `?${newParams.toString()}`
    });
};