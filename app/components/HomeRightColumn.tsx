import React, { useEffect, useState } from 'react';
import './component-styles/homerightcolumn.css';
import { useNavigate } from 'react-router-dom';
import { popular_books } from '../data/popularbooks';
import axios from 'axios';

import { formatGameDateParts } from '../utilities/dateformat.js';
import { openBet } from '../utilities/openbet.js';
import { getTeamLogo } from '../utilities/getteamlogo.js';
import { sports_data } from '../data/sportsdata.js';
import { available_books } from '../data/availablebooks.js';
import mobile from '../assets/mobile_logo.png';

import date from '../assets/calendar.png';
import time from '../assets/clock.png';
import enter from '../assets/arrow-right.png';
import arrow from '../assets/arrow2.png';
import live from '../assets/live.png';
import { GetLiveScores } from '../utilities/getlivescores.js';

export default function HomeRightColumn() {
    const [isOn, setIsOn] = useState(false);
    const navigate = useNavigate();

    const [upcomingGames, setUpcomingGames] = useState([]);
    const [liveGames, setLiveGames] = useState([]);

    const [liveScores, setLiveScores] = useState([]);

    const getUpcomingGames = async ( isOn ) => {
        try {
            let upcoming_response = [];

            if (!isOn) upcoming_response = await axios.post("https://propicks-data-api.com/v1/get-upcoming-games-dash");
            else upcoming_response = await axios.post("https://propicks-data-api.com/v1/get-live-games-dash");
            
            if(upcoming_response.status === 200 && !isOn) setUpcomingGames(upcoming_response.data.games);
            else if (upcoming_response.status === 200 && isOn) {
                setUpcomingGames(upcoming_response.data.games);
                setLiveGames(upcoming_response.data.games);
            }
        } catch (err) { console.log({ err: err.message }) };
    };

    const getLiveScore = async () => {
        for(let i = 0; i < liveGames.length; i++) {
            const score = await GetLiveScores(liveGames[i].home_team, liveGames[i].away_team, liveGames[i].sport_title)

            setLiveScores(prev => [...prev, score]);
        };
    };

    // useEffect to get upcoming games
    useEffect(() => {
        getUpcomingGames( isOn );
    }, []);
    
    // useEffect to get live game scores
    useEffect(() => {
        if (liveGames && liveGames.length > 0) getLiveScore();
    }, [liveGames]);

    return(
        <div className='games-detail-container'>
            <div 
                className={`toggle-container `}
                onClick={() => {
                    setIsOn(!isOn)
                    getUpcomingGames( !isOn );
                }}
            >
                <span className="toggle-label left">Upcoming Games</span>
                <span className="toggle-label right">Live Games <img src={live} height="16" width="16" /> </span>   
                <div className={`toggle-button ${isOn ? "on" : ""}`}></div>
            </div>
            <div className='game-details-column' >
                <div className='game-details-frame'>
                    {
                        ( upcomingGames && upcomingGames.length > 0) ? (
                            upcomingGames.map((event, index) => {
                                let dateObject = formatGameDateParts(event.commence_time);
                                return(
                                    <div className='game-details' key={event.uid} onClick={() => {
                                        navigate(`/game?game_id=${event.event_uid}`);
                                    }}>
                                        <div className='game-details-title'>
                                            <p className='event-title' >{event.event}</p>
                                            <p className='event-sport-info'>{event.sport_title} { sports_data
                                                .filter((sport) => sport.sport_code === event.sport_title)
                                                .map((sport) => `| ${sport.common_name}`) }</p>
                                            <div className='time-date-container' >
                                                <img src={date} height="14" width="14" />
                                                <p>{dateObject.dayPart}</p>
                                                <p> - </p>
                                                <img src={time} height="14" width="14" />
                                                <p>{dateObject.timePart}</p>
                                            </div>
                                        </div>
                                        <div className='game-details-info' >
                                            <div className={ isOn ? 'team-container-live upper' : 'team-container upper' } >
                                                <div className='name-holder' >
                                                    {getTeamLogo(event.home_team, 30)}
                                                    <p className='team-one' >
                                                        {event.home_team}
                                                    </p>
                                                </div>
                                                { isOn && liveScores[index] ? <p className='live-score' >{liveScores[index].score.home.score ? liveScores[index].score.home.score : "" }</p> : (<></>) }
                                            </div>
                                            <div className={ isOn ? 'team-container-live lower' : 'team-container lower' }  >
                                                <div className='name-holder' >
                                                    {getTeamLogo(event.away_team, 30)}
                                                    <p className='team-two' >
                                                        {event.away_team}
                                                    </p>
                                                </div>
                                                { isOn && liveScores[index] ? <p className='live-score' >{liveScores[index].score.away.score ? liveScores[index].score.away.score : "" }</p> : (<></>) }
                                            </div>
                                        </div>
                                        <div className='see-more-button' onClick={(e) => {
                                            e.stopPropagation();
                                            openBet(event.event, navigate);
                                        }} >
                                            <p>See Picks and Stats</p>
                                            <img src={enter} width="16" height="16" />
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className='no-games-container' >
                                <p>No games currently found.</p>
                            </div>
                        )
                    }
                    <div className='see-more-games-button' onClick={() => {navigate('/test-scanner')}}  >
                        <p>Find More Games</p>
                        <img src={enter} height="18" width="18" />
                    </div>
                </div>
                <div className='sports-book-container' >
                    <div className='sports-books-title-container' >
                        <p> ProPicks Mobile App </p>
                        { /*
                        <div className='more-books-button' onClick={() => {navigate("/offers")}}>
                            <p>Find More</p>
                            <img src={arrow} height="10" width="10" />
                        </div>
                        */ }
                    </div>
                    {/*
                    <div className='sports-book-offer-container' >
                        {
                            available_books.map((book) => {
                                return (
                                  <div
                                    className="sports-book-offer"
                                    key={book.name}
                                    onClick={() => window.open(book.link, "_blank")}
                                  >
                                    <div className="sports-book-logo">
                                      <img src={book.logo} alt={`${book.name} logo`} />
                                    </div>
                                    <div className="offer-title-container">
                                      <p className="offer-title">{book.offer}</p>
                                      <p className="offer-subtitle">{book.suboffer}</p>
                                    </div>
                                    <div className="claim-offer-button">
                                      <p>Claim</p>
                                    </div>
                                  </div>
                                );
                              })
                              
                        }
                    </div>
                    */}
                    <div
                        className="sports-book-offer"
                        onClick={() => window.open("https://apps.apple.com/us/app/propicks-social/id6755331225", "_blank")}
                    >
                        <div className="sports-book-logo">
                            <img src={mobile} alt={`propicks mobile logo`} />
                        </div>
                        <div className="offer-title-container">
                            <p className="offer-title">Propicks Social App</p>
                            <p className="offer-subtitle">Download Free Today</p>
                        </div>
                        <div className="claim-offer-button">
                            <p>Install</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>    
    )
}