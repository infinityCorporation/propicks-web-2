import React from 'react';
import './component-styles/betinfoscreen.css';

import { auditBetBook } from '../utilities/auditbook';
import { getBookLogo } from '../utilities/getbooklogo';
import { getTeamLogo } from '../utilities/getteamlogo';
import { openBook } from '../utilities/openbook';
import { sportsbook_data } from '../data/bookdata';
import { getRelativeTime } from '../utilities/timedistance';
import { eventTimeCheck } from '../utilities/eventtimecheck'

import calendar from '../assets/calendar.png';
import { formatGameDateParts } from '../utilities/dateformat';

export default function BetInfoScreen({ betInfoBool, navigate, betObject, setBetObject, setBetInfoBool, setAttachedBet, setMainBlurred, betPostId, navToDash, attached_type, isInReply, attachmentBool }: any) {
    let bet = betObject, event_ended = false;
    
    if(betObject === {}) setBetInfoBool(false);
    if(attachmentBool) bet = betObject.bet_object;

    if (bet.commence_time) event_ended = eventTimeCheck(bet.commence_time);

    switch (attached_type) {
        case 'bet':
            return (
                <div className={`${betInfoBool ? "bet-info-screen" : "not-shown"}`}>
                    <div className="bet-header-container" onClick={() => {
                        if(!event_ended) navigate(`/test-scanner?search=${bet.event}`);
                    }}>
                        <p className="bet-title">{bet.event}</p>
                        <div className='bet-book-group'>
                            <img src={getBookLogo(bet.book)} height="24" width="24" />
                            <p className="bet-subtitle">{auditBetBook(bet.book)}</p>    
                        </div>
                        <div className='bet-calendar-group' >
                            { bet.commence_time ? (<>
                            <img src={calendar} height="24" width="24" />
                            <p className='bet-subtitle'>{formatGameDateParts(bet.commence_time).dayPart} {event_ended ? "- Event Ended" : ""}</p>
                            </>) : (<></>) }
                        </div>
                    </div>
                    { bet.outcomes ? (<>
                        {
                            bet.outcomes.map((outcome) => {
                                return(
                                    <div className="bet-line-info-container">
                                        <div className='bet-team-group'>
                                            {getTeamLogo(outcome.name, 28)}
                                            <p className="line-title">{outcome.name} { outcome.point ? outcome.point : "" }</p>    
                                        </div>
                                        <p className='line-title'>{outcome.price}</p>
                                    </div>
                                )
                            })
                        }
                    </>) : (<></>)}
                    { (betPostId && !isInReply) ? (<>
                        <div className='cta-buttons-container'>
                            <button className="cta-button signup-button" onClick={() => {
                                navigate(`/test-chat?id=${betPostId}`)
                            }}>View Thread</button>
                        </div>
                    </>) : (<></>)}
                    <div className="cta-buttons-container">
                        <button className="cta-button signin-button" onClick={() => {
                            if(navToDash) {
                                setBetObject({});
                                navigate(`/?bet=${bet.uid}`)
                            } else {
                                setAttachedBet(bet);
                                setBetInfoBool(false);
                                setMainBlurred(false);
                                setBetObject({})
                            }
                        }}>Post Bet</button>
                        <button className="cta-button signin-button" onClick={() => {
                            const book = sportsbook_data.filter((book) => book.book_code === bet.book)[0]
                            openBook(book.url)
                        }}>Open Book</button>
                    </div>
                </div>
            )
        case 'pick':

        const getPickClassName = () => {
            if (betInfoBool && betObject.bet_won) return "bet-won-screen";
            if (betInfoBool && !betObject.bet_won) return "bet-info-screen";
            else return "not-shown";
        }
            return (
                <div className={getPickClassName()}>
                    <div className="bet-header-container" onClick={() => {
                        if(!event_ended) navigate(`/test-scanner?search=${bet.event}`);
                    }}>
                        <p className="bet-title">{bet.event}</p>
                        <div className='bet-book-group'>
                            <img src={getBookLogo(bet.book)} height="24" width="24" />
                            <p className="bet-subtitle">{auditBetBook(bet.book)}</p>    
                        </div>
                        <div className='bet-calendar-group' >
                            { bet && bet.commence_time ? (<>
                            <img src={calendar} height="24" width="24" />
                            <p className='bet-subtitle'>{formatGameDateParts(bet.commence_time).dayPart} {event_ended ? "- Event Ended" : ""}</p>
                            </>) : (<></>) }
                        </div>
                    </div>
                    { bet.pick ? (
                        <div className="bet-line-info-container">
                            <div className='bet-team-group'>
                                {getTeamLogo(bet.pick.name, 28)}
                                <p className="line-title">{bet.pick.name} { bet.pick.point ? bet.pick.point : "" }</p>    
                            </div>
                            <p className='line-title'>{bet.pick.price}</p>
                        </div>
                    ) : (<></>)}
                    { betPostId && !isInReply ? (<>
                        <div className='cta-buttons-container'>
                            <button className="cta-button signup-button" onClick={() => {
                                navigate(`/test-chat?id=${betPostId}`)
                            }}>View Thread</button>
                        </div>
                    </>) : (<></>)}
                    <div className="cta-buttons-container">
                        { !attachmentBool ? (<>
                            <button className="cta-button signin-button" onClick={() => {
                                if(navToDash) {
                                    setBetObject({});
                                    navigate(`/?bet=${bet.uid}`)
                                } else {
                                    setAttachedBet(bet);
                                    setBetInfoBool(false);
                                    setMainBlurred(false);
                                    setBetObject({})
                                }
                            }}>Post Bet</button>
                        </>) : (<></>)}
                        <button className="cta-button signin-button" onClick={() => {
                            const book = sportsbook_data.filter((book) => book.book_code === bet.book)[0]
                            openBook(book.url)
                        }}>Open Book</button>
                    </div>
                </div>
            )
        case 'parlay':
            return (
                <div className={`${betInfoBool ? "bet-info-screen" : "not-shown"}`}>
                    <div className="bet-header-container" onClick={() => {
                        if(!event_ended) navigate(`/test-scanner?search=${bet.event}`);
                    }}>
                        <div className='parlay-title-group' >
                        <p className="bet-title">{bet[0].line_count} Leg Parlay</p>
                        <p className='bet-title'>{bet[0].total_odds > 0 ? `+${bet[0].total_odds}` : bet[0].total_odds }</p>
                        </div>
                        <div className='bet-book-group'>
                            <img src={getBookLogo(bet[0].book)} height="24" width="24" />
                            <p className="bet-subtitle">{auditBetBook(bet[0].book)}</p>    
                        </div>
                        <div className='bet-calendar-group' >
                            <img src={calendar} height="24" width="24" />
                            <p className='bet-subtitle'>{betObject.created_at ? getRelativeTime(betObject.created_at) : getRelativeTime(bet.last_update)} {event_ended ? "- Event Ended" : ""}</p>
                        </div>
                    </div>
                    { bet[0].lines ? (<>
                        {
                            bet[0].lines.map((line) => {
                                return(
                                    <div className="bet-line-info-container">
                                        <div className='bet-team-group'>
                                            {getTeamLogo(line.outcome.name, 28)}
                                            <p className="line-title">{line.outcome.name} { line.outcome.point ? line.outcome.point : "" }</p>    
                                        </div>
                                        <p className='line-title'>{line.outcome.price}</p>
                                    </div>
                                )
                            })
                        }
                    </>) : (<></>)}
                    { betPostId && !isInReply ? (<>
                        <div className='cta-buttons-container'>
                            <button className="cta-button signup-button" onClick={() => {
                                navigate(`/test-chat?id=${betPostId}`)
                            }}>View Thread</button>
                        </div>
                    </>) : (<></>)}
                    <div className="cta-buttons-container">
                        <button className="cta-button signin-button" onClick={() => {
                            const book = sportsbook_data.filter((book) => book.book_code === bet[0].book)[0]
                            openBook(book.url)
                        }}>Open Book</button>
                    </div>
                </div>
            )
        default:
            return (<></>)
    }
}