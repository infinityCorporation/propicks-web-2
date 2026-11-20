import React, {useState, useReducer, useEffect} from 'react'
import axios from 'axios'
import './component-styles/gamemodule.css'

export default function GameModule() {
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const [gamesData, setGamesData] = useState([]);
    const [dataExists, setExists] = useState(false);

    const propogateGamesData = async () => {
        await axios.get("https://propicks-data-api.com/games-data")
            .then((response) => {
                console.log(response.data.bets)
                setGamesData(response.data.bets);
                if(response.data.bets != undefined || response.data.bets != null){
                    setExists(true);  
                }
            })
            .catch((e) => {
                console.log("There was an error.");
                console.log({ message: e.message });
            })
    }

    useEffect(() => {
       propogateGamesData();
        // forceUpdate();
    }, [])

    if(gamesData == undefined || gamesData == null){
        return(
            <>
                <p>Loading...</p>
            </>
        )
    }

    return (
        <div className='game-module-main'>
            {dataExists ? (
                    <div className='table-container-games-module'>
                        <table>
                            <thead className='table-header-games-module'>
                                <tr>
                                    <th>Upcoming Events</th>
                                    <th>Sport</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {gamesData.map((game) => {
                                    let event = game.event;
                                    let sport = game.sport_title;
                                    let time = game.commence_time;

                                    const date = new Date(time)
                                    const options = {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        timeZone: 'America/New_York',
                                        timeZoneName: 'short'
                                    };
                                    
                                    const formatted_time = new Intl.DateTimeFormat('en-US', options).format(date);
                                    
                                    return (
                                        <tr key={game.uid}>
                                            <td>
                                                <div className='cell-content'>
                                                    <p>{event}</p>
                                                </div>
                                            </td>
                                            <td>
                                                <div className='cell-content'>
                                                    <p>{sport}</p>
                                                </div>
                                            </td>
                                            <td>
                                                <div className='cell-content'>
                                                    <p>{formatted_time}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                <>
                    <p>No Data Loaded</p>
                </>
                )}
        </div>
    )
}