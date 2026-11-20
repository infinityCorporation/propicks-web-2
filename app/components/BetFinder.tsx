import React, { useState, useEffect } from 'react';

import { handleInput } from '../utilities/handleinput';
import { searchBets } from '../utilities/betsearch';
import { handleKeyDown } from '../utilities/handlekeydown';
import { getBookLogo } from '../utilities/getbooklogo';
import { auditBetBook } from '../utilities/auditbook';
import { auditBetKey } from '../utilities/auditkey';
import { searchBetsEmpty } from '../utilities/betsearchempty';
import { getTeamLogo } from '../utilities/getteamlogo';

import search from '../assets/search.png';
import exit from '../assets/exit.png';
import right from '../assets/arrow-right.png';

export default function BetFinder({ betFinderOpen, setBetFinderOpen, setMainBlurred, setAttachedBet, navigate}: any) {
    const [betSearch, setBetSearch] = useState("");
    const [betResponse, setBetResponse] = useState([]);
    const [selectedBet, setSelectedBet] = useState({});

    useEffect(() => {
        if (betSearch == "") searchBetsEmpty(setBetResponse);
        else searchBets(betSearch, setBetResponse);
    }, [betSearch])

    return (
        <div className={`${betFinderOpen ? "bet-finder-container mobile-bet-finder" : "not-shown"}`} >
            <div className='search-container-top'>
                <div className='team-search-title-container' >
                    <p>Attach Betting Line</p>
                    <img src={exit} height="16" width="16" onClick={() => {
                        setMainBlurred(false);
                        setBetFinderOpen(false);
                    }} />
                </div>
                <div className='top-search-container' >
                    <div className='search-container-dash'>
                        <img src={search} height="18" width="18" />
                        { /* Once the company has the resources, you can changes () => searchBets() to just searchBets()
                            and the call will be made on every single key down call meaning it auto updates */ }
                        <textarea className='search-input' value={betSearch} placeholder='Search by Event...' onChange={(e) => {
                            handleInput(e, setBetSearch);
                            setBetResponse([]);
                        }} onKeyDown={(e) => handleKeyDown(e, () => searchBets(betSearch, setBetResponse))} />
                    </div>
                    <div className='dash-search-button' onClick={() => {searchBets(betSearch, setBetResponse)}} >
                        <p>Search</p>
                    </div>
                </div>
            </div>
            <div className='search-results-container' >
                { (betResponse.length > 0) ? (<>
                    {
                        betResponse.map((event, index) => {
                            return(
                                <div className='event-row' key={index} onClick={() => {navigate(`/game?game_id=${event.event_id}`)}}>
                                    <div className='event-name-container'>
                                        <p className='event-name' >{event.event}</p>
                                        <img src={right} height="16" width="16" style={{marginTop: 6}} />
                                    </div>
                                    
                                    <div className='event-bets-row' >
                                        {
                                            event.lines.map((line) => {
                                                return(
                                                    <div className={`bet-search-container ${(line.uid == selectedBet.uid) ? "selected-line" : ""}`} onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedBet(line)
                                                    }}>
                                                        <div className='bet-select-header' >
                                                            <img src={getBookLogo(auditBetBook(line.book))} height="20" width="20" />
                                                            <p>{auditBetBook(line.book)} - {auditBetKey(line.key)}{ line.outcomes[0].point ? `: ${line.outcomes[0].point}` : "" }</p>
                                                            { /* consider adding the point here */ }
                                                        </div>
                                                        <div className='outcomes-container' >
                                                            { line.outcomes.map((outcome) => {
                                                                return(
                                                                    <div className='outcome-display' key={outcome.name} >
                                                                        <div className='bet-team-container' >
                                                                            {getTeamLogo(outcome.name, 24)}
                                                                            <p>{outcome.name}</p>
                                                                        </div>
                                                                        <p>{ (outcome.price > 0) ? (`+${outcome.price}`) : outcome.price}</p>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </>) : (<></>)}
            </div>
            <div className='search-container-bottom'>
            <div className='dash-add-button team-cancel' onClick={() => {
                    setMainBlurred(false);
                    setBetFinderOpen(false);
                }} >
                    <p>Cancel</p>
                </div>
                <div className='dash-add-button' onClick={() => {
                    setMainBlurred(false);
                    setBetFinderOpen(false);
                    setAttachedBet(selectedBet);
                }}>
                    <p>Add</p>
                </div>
            </div>
        </div>
    )
}