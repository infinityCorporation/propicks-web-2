import axios from 'axios';

export const createBetObject = async (uid: any, bet: any, bet_type: any, league: any) => {
    try {
        const create_response = await axios.post("https://propicks-data-api.com/v1/create-bet-object", {
            user_id: uid,
            bet: bet,
            bet_type: bet_type,
            created_at: new Date().toISOString(),
            league: league,
        });

        if (create_response.status === 200) return "successful";
        else return "failed"
    } catch (err: any) {
        console.log({ err: err.message });
    }
}