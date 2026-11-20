import { createSearchParams } from "react-router-dom";

export const openChat = (chat_id, navigate) => {

    const newParams = createSearchParams({
        id: chat_id
    });
    
    navigate({
        pathname: '/test-chat',
        search: `?${newParams.toString()}`
    });
};