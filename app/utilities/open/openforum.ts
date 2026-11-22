import { createSearchParams } from "react-router-dom";

export const openForum = (forum_id: any, forum_name: any, navigate: any) => {
    const newParams = createSearchParams({
        id: forum_id,
        name: forum_name,
    });

    navigate({
        pathname: "/test-forum",
        search: `?${newParams.toString()}`
    });
};