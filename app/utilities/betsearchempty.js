import axios from 'axios';

export const searchBetsEmpty = async (setBetResponse) => {
    try {
        const bet_response = await axios.post("https://propicks-data-api.com/v1/search-bets-empty", {});

        if(bet_response.status == 200){
            setBetResponse(bet_response.data.search_result);
        } else console.log("Theres been an error: ", bet_response.status);
    } catch (err) { console.log({ err: err.message }) }
};