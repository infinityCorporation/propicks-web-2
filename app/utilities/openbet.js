import React from 'react';
import { createSearchParams } from 'react-router-dom';

export const openBet = async (search, navigate) => {
    const newParams = createSearchParams({
        search: search
    });

    navigate({
        pathname: "/test-scanner",
        search: `?${newParams.toString()}`
    });
};