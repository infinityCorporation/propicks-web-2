import axios from 'axios';

export const GetLiveScores = async ( home_team, away_team, league) => {
    try {
        const score_response = await axios.post("https://propicks-data-api.com/v1/get-live-scores", {
            home_team: home_team,
            away_team: away_team,
            league: league
        })

        if (score_response.status === 200) return score_response.data;
        else return null;
    } catch (err) {
        console.log({ err: err.message })
    }
}