import axios from 'axios';

export const searchBets = async (betSearch: any, setBetResponse: any) => {
    try {
        const bet_response = await axios.post("https://propicks-data-api.com/v1/search-bets", {
            search: betSearch,
        })

        if(bet_response.status == 200){
            setBetResponse(bet_response.data.search_result);
        } else console.log("Theres been an error: ", bet_response.status);
    } catch (err: any) { console.log({ err: err.message }) }
};