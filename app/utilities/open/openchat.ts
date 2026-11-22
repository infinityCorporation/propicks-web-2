import { createSearchParams } from "react-router";

export const openChat = (chat_id: any, navigate: any) => {

    const newParams = createSearchParams({
        id: chat_id
    });
    
    navigate({
        pathname: '/test-chat',
        search: `?${newParams.toString()}`
    });
};