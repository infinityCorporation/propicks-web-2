import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './component-styles/pickingwindow.css';
import { sportsbook_data } from '../data/bookdata';

import enter from '../assets/arrow-right.png';
import { sports_data } from '../data/sportsdata';
import { formatGameDateParts } from '../utilities/dateformat';
import { auditBetBook } from '../utilities/auditbook';
import { getBookLogo } from '../utilities/getbooklogo';

import up from '../assets/up-arrow.png';
import down from '../assets/down.png';

const BetDisplay = ({ type, linesArr, setStep, setBet }) => {
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (type === 'Moneyline:') setExpanded(true);
    }, []);

    if (linesArr.length > 0) {
        return (
            <div className='bet-pick-display' >
                <div className='bet-display-title-container' onClick={() => setExpanded(!expanded)} >
                    <p className='bet-display-title' >{type}</p>
                    <img src={ expanded ? up : down } height="22" width="22" />
                </div>
                { expanded ? (<>
                    <div className='bet-pick-scroll' >
                        {
                            linesArr.map((line) => {
                                return (
                                    <div className='line-pick-module' onClick={() => {
                                        setStep(prev => prev + 1);
                                        setBet(line);
                                    }}>
                                        <div className='line-pick-book-info' >
                                            <img src={getBookLogo(line.book)} height="20" width="20" />
                                            <p>{auditBetBook(line.book)}</p>
                                        </div>
                                        <div className='line-pick-outcomes' >
                                            {
                                                line.outcomes.map((outcome) => {
                                                    return (
                                                        <div className='line-pick-outcome' >
                                                            <p>{outcome.name}</p>
                                                            <p>{outcome.price}</p>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </>) : (<></>) }
            </div>
        )
    }
}

const AttachPick = ({ setPickingType, setAttachedBetType, setAttachedPick }) => {
    const [step, setStep] = useState(1);
    const [selectedLeague, setSelectedLeague] = useState('');

    const [leagueGames, setLeagueGames] = useState([]);
    const [gameLines, setGameLines] = useState({});
    const [gameLinesExist, setGameLinesExist] = useState(false);

    const [bet, setBet] = useState({});
    const [selectedLine, setSelectedLine] = useState({});
    const [pick, setPick] = useState({});

    const [wager, setWager] = useState('0.00');
    const [wagerNumber, setWagerNumber] = useState(0.00)

    const createPick = (line, pick, wager) => {
        let new_pick = {
            uid: line.uid,
            book: line.book,
            event: line.event,
            event_uid: line.event_uid,
            key: line.key,
            team_one: line.team_one,
            team_two: line.team_two,
            point: line.point,
            pick: pick,
            commence_time: line.commence_time,
            wager: Number(wager),
            league: selectedLeague,
        };
        return new_pick;
    };

    const updateWager = (e) => {
        setWager(e.target.value);
        setWagerNumber(Number(e.target.value).toFixed(2))
    }

    const getLeagueGames = async ( league ) => {
        try {
            const league_response = await axios.post('https://propicks-data-api.com/v1/get-league-games', {
                sport_titles: [league]
            });

            console.log(league_response.data);

            if (league_response.status === 200) setLeagueGames(league_response.data.games);
            else setLeagueGames([]);
        } catch (err) {
            console.log({ err: err.message })
        }
    };

    const getGameLines = async ( event_uid ) => {
        try {
            const lines_response = await axios.post("https://propicks-data-api.com/v1/get-game-lines", {
                event_uid: event_uid,
            });

            if (lines_response.status === 200) {
                setGameLines(lines_response.data.lines);
                setGameLinesExist(true);
            } else setGameLines({});
        } catch (err) { 
            console.log({ err: err.message });
        }
    };

    switch (step) {
        case 1: 
            return (
                <div className='pick-content' >
                    {
                        sports_data.map((sport) => {
                            return (
                                <div className={ selectedLeague === sport.sport_code ? "sport-pick-module sport-pick-module-active" : "sport-pick-module"} onClick={() => {
                                    if (selectedLeague === sport.sport_code) setSelectedLeague('');
                                    else {
                                        setSelectedLeague(sport.sport_code);
                                        setStep(step + 1);
                                        getLeagueGames(sport.sport_code);
                                    }
                                }}>
                                    <div className='sport-info' >
                                        <p>{sport.sport_name}</p>
                                    </div>
                                    <div className='sport-enter' >
                                        <img src={enter} height="22" width="22" />
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            )
        case 2: 
            return (
                <div className='pick-content' >
                    <button className='pick-back-button' onClick={() => {setStep(step - 1)}} >
                        <p>Back</p>
                    </button>
                    {   leagueGames.length > 0 ? (
                            <> {
                            leagueGames.map((game) => {
                                let gameTime = formatGameDateParts(game.commence_time);

                                return (
                                    <div className='game-pick-module' onClick={() => {
                                        getGameLines(game.event_uid);
                                        setStep(step + 1)
                                    }} >
                                        <div className='game-pick-info' >
                                            <p className='game-pick-title' >{game.event}</p>
                                            <p className='game-pick-time-info' >{gameTime.dayPart} @ {gameTime.timePart}</p>
                                        </div>
                                        <div className='game-pick-enter' >
                                            <img src={enter} height="22" width="22" />
                                        </div>
                                    </div>
                                )
                            })
                        } </>) : (<>
                            <p className='no-games-pick-message' >No Games Found</p>
                        </>)
                    }
                </div>
            )
        case 3: 
            return (
                <div className='pick-content-lines' >
                    <button className='pick-back-button-lines' onClick={() => {
                        setStep(step - 1);
                        setGameLinesExist(false);
                    }} >
                        <p>Back</p>
                    </button>
                    <div className='pick-bets-content' >
                        { gameLinesExist ? (<>
                            <div className='pick-moneyline-bets' >
                                <BetDisplay type="Moneyline:" linesArr={gameLines.money} setBet={setBet} setStep={setStep} />
                                <BetDisplay type="Totals:" linesArr={gameLines.total} setBet={setBet} setStep={setStep} />
                                <BetDisplay type="Spreads:" linesArr={gameLines.spread} setBet={setBet} setStep={setStep} />
                            </div>
                        </>) : (<><p>Loading...</p></>)}
                    </div>
                </div>
            )
        case 4:
            return (
                <div className='pick-content' >
                    <button className='pick-back-button' onClick={() => {setStep(step - 1)}} >
                        <p>Back</p>
                    </button>
                    <div className='make-pick-container' >
                        <div>
                            <div className='make-pick-book-info' >
                                <img src={getBookLogo(bet.book)} height="22" width="22" />
                                <p>{auditBetBook(bet.book)}</p>
                            </div>
                            <div className='make-pick-outcomes' >
                                {
                                    bet.outcomes.map((line) => {
                                        return (
                                            <div className={ selectedLine.name == line.name ? 'make-pick-outcome outcome-active' : 'make-pick-outcome' } onClick={() => {
                                                if (selectedLine.name == line.name) setSelectedLine({});
                                                else setSelectedLine(line);
                                            }}>
                                                <p>{line.name}</p>
                                                <p>{line.price}</p>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className='make-pick-wager' >
                                <p>Wager:</p>
                                <div className='wager-input-group' >
                                    <p>$</p>
                                    <input value={wager} type="text" className='pick-wager-input' onChange={(e) => {updateWager(e)}} />
                                </div>
                            </div>
                        </div>
                        <div className={ wagerNumber <= 0 ? 'make-pick-button make-pick-button-inactive' : 'make-pick-button' } onClick={() => {
                            setAttachedPick(createPick(bet, selectedLine, wagerNumber));
                            setAttachedBetType('pick');
                            setPickingType('');
                        }}>
                            <p>Add Pick</p>
                        </div>
                    </div>
                </div>
            )
        default: 
            return (
                <div className='pick-content' >
                    <p>Loading...</p>
                </div>
            )
    }
}

const AttachParlay = ({ setPickingType, setAttachedBetType, setAttachedParlay }) => {
    const [selectedBook, setSelectedBook] = useState('');
    const [step, setStep] = useState(1);

    const getBookEvents = async () => {
        try {
            const event_response = await axios.post('https://propicks-data-api.com/v1/')
        } catch (err) {
            console.log({ err: err.message });
        }
    }

    switch (step) {
        case 1:
            return (
                <div className='pick-content' >
                    {
                        sportsbook_data.map((book) => {
                            return (
                                <div className={ selectedBook === book.book_code ? 'pick-book-module pick-book-module-active' : 'pick-book-module' } onClick={() => {
                                    if (selectedBook === book.book_code) setSelectedBook('');
                                    else {
                                        setSelectedBook(book.book_code);
                                        setStep(prev => prev + 1);
                                    }
                                }} >
                                    <div className='pick-book-info' >
                                    <img src={book.book_logo} height="22" width="22" />
                                    <p>{book.book_name}</p>
                                    </div>
                                    <div className='pick-book-enter' >
                                        <img src={enter} height="20" width="20" />
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            )
        case 2: 
            return (
                <div className='pick-content' >
                    <button className='pick-back-button' onClick={() => {setStep(step - 1)}} >
                        <p>Back</p>
                    </button>

                </div>
            )
        case 3: 
            return (
                <div className='pick-content' >

                </div>
            )
        default:
            return (
                <div className='pick-content' >
                    <p>Something has gone wrong. Refresh the page and try again.</p>
                </div>
            )
    }
}

export default function PickingWindow({ pickingType, setPickingType, setAttachedBetType, setAttachedPick, setAttachedParlay, attachedPick, attachedParlay, attachedBetType }) {
    const [finishedPicking, setFinishedPicking] = useState(false);

    if (finishedPicking) {
        // Show the type with options to change here
        return (
            <div className='finished-picking-window' >
            </div>
        )
    }

    switch (pickingType) {
        case 'pick': 
            return (
                <div className='picking-window-1' >
                    <AttachPick setPickingType={setPickingType} setAttachedBetType={setAttachedBetType} setAttachedPick={setAttachedPick} />
                </div>
            )
        case 'parlay': 
            return (
                <div className='picking-window-2' >
                    <AttachParlay setPickingType={setPickingType} setAttachedBetType={setAttachedBetType} setAttachedParlay={setAttachedParlay} />
                </div>
            )
        case 'team':
            return (
                <div className='picking-window-3'>

                </div>
            )
        default:
            return (<></>)
    }
}