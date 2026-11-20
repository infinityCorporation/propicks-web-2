import axios from 'axios';

export const searchTeams = async (teamSearch: any, setTeamResponse: any) => {
    try {
        const response = await axios.post("https://propicks-data-api.com/v1/search-teams", {
            search: teamSearch,
        })

        if(response.status == 200){
            setTeamResponse(response.data.search_result);
        } else console.log("Theres been an error: ", response.status);
    } catch (err: any) { console.log({ err: err.message }) }
};