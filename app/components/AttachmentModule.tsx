import { useState, useEffect } from 'react';
import axios from 'axios';
import './component-styles/attachmentmodule.css';

import { auditBetKey } from '../utilities/auditkey';
import { getBookLogo } from '../utilities/getbooklogo';
import { auditBetBook } from '../utilities/auditbook';
import { getTeamLogo } from '../utilities/getteamlogo';
import { formatGameDateParts } from '../utilities/dateformat';
import { calculatePayout } from '../utilities/calculatewinnings';

import calendar from '../assets/calendar.png';
import right from '../assets/arrow-right.png';

export default function AttachmentModule({ post, setBetObject, setBetPostId, setMainBlurred, setBetInfoBool, setBetInfoType, setAttachmentBool }) {
    let formatted_time, bet_line;

    const [fullParlay, setFullParlay] = useState({});
    const [fullParlayExists, setFullParlayExists] = useState(false);

    const [pickObject, setPickObject] = useState({});
    const [pickObjectExists, setPickObjectExists] = useState(false);

    // A new solution needs to be made for this but for the time being this works
    const getBetResult = async (bet_uid) => {
        try {
            const bet_response = await axios.post("https://propicks-data-api.com/v1/get-bet-object", {
                bet_uid: bet_uid,
            });

            if (bet_response.status == 200) {
                if (bet_response.data.bet != null) {
                    setPickObject(bet_response.data.bet);
                    setPickObjectExists(true);
                }
            } else {
                setPickObject({});
                setPickObjectExists(false);
            }
        } catch (err) {
            console.log({ err: err.message });
            setPickObject({})
            setPickObjectExists(false);
        }
    };

    const getFullParlay = async (id) => {
        try {
            const parlay_response = await axios.post('https://propicks-data-api.com/v1/get-parlay', {
                parlay_id: id,
            });

            if (parlay_response.status === 200) {
                setFullParlay(parlay_response.data.parlay);
                setFullParlayExists(true);
            } else setFullParlay({});
        } catch (err) {
            console.log({ err: err.message });
        }
    };

    useEffect(() => {
        if (post.attached_bet_type === "parlay" || post.attachment_type === 'parlay') getFullParlay(JSON.parse(post.attached_parlay).uid);
        if (post.attached_bet_type === "pick" || post.attachment_type === 'pick') getBetResult(JSON.parse(post.attached_pick).uid);
    }, []);

    switch (post.attachment_type) {
        case 'bet':
            bet_line = JSON.parse(post.betting_line);
            formatted_time = formatGameDateParts(bet_line.commence_time)

            return (
                
                <div className='attached-pick-module' onClick={() => {
                    setBetObject(bet_line);
                    setBetPostId(post.message_id);
                    setMainBlurred(true);
                    setBetInfoBool(true);
                    setBetInfoType('pick');
                }}>
                    <div className='bet-info-container'>
                        <p className='bet-info-title'>{bet_line.event}</p>
                        <div className='bet-book-container'>
                            <img src={getBookLogo(bet_line.book)} height="16" width="16" style={{ borderRadius: '50%' }} />
                            <p className='bet-book-name'>{auditBetBook(bet_line.book)}</p>
                            <span className='book-dot' />
                            <p className='time-color'>{auditBetKey(bet_line.key)}</p>
                        </div>
                        <div className='bet-info-time-container'>
                            <img src={calendar} height="16" width="16" style={{ opacity: 0.5 }} />
                            <p className='time-color'>{formatted_time.dayPart} @ {formatted_time.timePart}</p>
                        </div>
                    </div>
                    <div className='bet-lines-container'>
                        { bet_line.outcomes.map((outcome) => {
                            return (
                                <div className='bet-line'>
                                    <div className='bet-team-container'>
                                        {getTeamLogo(outcome.name, 24)}
                                        <div className="bet-team-name-container" >
                                            <p className="bet-team-name" >{outcome.name}</p>
                                            <p style={{ fontSize: 11, color: '#595959', margin: 0, marginTop: 1 }}>{auditBetKey(bet_line.key)}</p>
                                        </div>
                                    </div>
                                    <p style={{ color: outcome.price < 0 ? '#B3B3B3' : '#4775FF', margin: 0, }}>
                                        {outcome.price > 0 ? `+${outcome.price}` : outcome.price}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        case 'pick':
            bet_line = JSON.parse(post.attached_pick);
            formatted_time = formatGameDateParts(bet_line.commence_time ? bet_line.commence_time : post.post_date);

            return (
                <div className={pickObject.bet_settled && pickObject.bet_won ? 'attached-pick-module bet-won' : 'attached-pick-module'} onClick={() => {
                    if (pickObjectExists) {
                        setBetObject(pickObject);
                        setAttachmentBool(true);
                    } else setBetObject(bet_line);
                    setBetPostId(post.message_id);
                    setMainBlurred(true);
                    setBetInfoBool(true);
                    setBetInfoType('pick');
                }}>
                    <div className={ pickObject.bet_settled ? 'bet-info-container bet-won-container' : 'bet-info-container'}>
                        { pickObject.bet_settled ? (<>
                            { pickObject.bet_won ? (<>
                                <p className='bet-won-label'>Winner</p>
                            </>) : (<>
                                <p className='bet-won-label'>Lost</p>
                            </>)}
                        </>) : (<></>) }
                        <p className='bet-info-title'>{bet_line.event}</p>
                        <div className='bet-book-container'>
                            <img src={getBookLogo(bet_line.book)} height="16" width="16" style={{ borderRadius: '50%' }} />
                            <p className='bet-book-name'>{auditBetBook(bet_line.book)} - {auditBetKey(bet_line.key)}</p>
                        </div>
                        <div className='bet-info-time-container'>
                            <img src={calendar} height="16" width="16" style={{ opacity: 0.5 }} />
                            <p className='time-color'>{formatted_time.dayPart} @ {formatted_time.timePart}</p>
                        </div>
                    </div>

                    <div className='bet-lines-container'>
                        <div className='bet-line'>
                            <div className='bet-team-container'>
                                {getTeamLogo(bet_line.pick.name, 24)} 
                                <div className='bet-team-name-container' >
                                    <p className='bet-team-name' >{bet_line.pick.name}</p>
                                    <p style={{ fontSize: 11, color: '#595959', margin: 0, marginTop: 1 }}>{auditBetKey(bet_line.key)}</p>
                                </div>
                            </div>
                            <p style={{ color: bet_line.pick.price < 0 ? '#B3B3B3' : '#4775FF', margin: 0 }}>
                                {bet_line.pick.price > 0 ? `+${bet_line.pick.price}` : bet_line.pick.price}
                            </p>
                        </div>

                        <div className='bet-section-divider'>
                            <div className='bet-section-divider-line' />
                            <span className='bet-section-divider-label'>WAGER & PAYOUT</span>
                            <div className='bet-section-divider-line' />
                        </div>

                        <div className='wager-section'>
                            <div className='wager-section-half'>
                                <span className='wager-key'>WAGER</span>
                                <span className='wager'>${bet_line.wager ?? '10.00'}</span>
                            </div>

                            <div className='wager-section-half-right'>
                                <span className='wager-key'>PAYS</span>
                                <span className='winnings'>${calculatePayout(bet_line.pick.price, bet_line.wager).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        case 'parlay':
            bet_line = JSON.parse(post.attached_parlay);

            return (
                <div className='attached-parlay-module' onClick={() => {
                    if (fullParlayExists) {
                        setBetObject(fullParlay);
                        setBetPostId(post.message_id);
                        setMainBlurred(true);
                        setBetInfoBool(true);
                        setBetInfoType('parlay');
                    }
                }} >
                    <div className='bet-info-container' >
                        <p className='bet-info-title'>{bet_line.line_count} Leg Parlay</p>
                        <div className='bet-book-container' >
                            <img src={getBookLogo(bet_line.book)} height="19" width="19" />
                            <p className='bet-book-name' >{auditBetBook(bet_line.book)} </p>    
                        </div>
                        <div className='bet-info-time-container' >
                            <p className='bet-info-title time-color'>Click to see more</p>
                            <img src={right} height="17" width="17" style={{marginTop: 4, marginLeft: -2}} />
                        </div>
                    </div>
                        <div className='bet-lines-container' >
                            <div className='bet-line'>
                                <p className='bet-team-name' style={{ marginTop: 4, marginBottom: 4}}>{bet_line.line_count} Lines</p>  
                                <p style={{ color: bet_line.total_odds < 0 ? '#B3B3B3' : '#4775FF', margin: 0 }}>
                                    {bet_line.total_odds > 0 ? `+${bet_line.total_odds}` : bet_line.total_odds}
                                </p> 
                            </div>
                        
                            <div className='bet-section-divider'>
                                <div className='bet-section-divider-line' />
                                <span className='bet-section-divider-label'>WAGER & PAYOUT</span>
                                <div className='bet-section-divider-line' />
                            </div>

                            <div className='wager-section'>
                                <div className='wager-section-half'>
                                    <span className='wager-key'>WAGER</span>
                                    <span className='wager'>${bet_line.wager ?? '10.00'}</span>
                                </div>

                                <div className='wager-section-half-right'>
                                    <span className='wager-key'>PAYS</span>
                                    <span className='winnings'>${calculatePayout(bet_line.total_odds, Number(bet_line.wager)).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                </div>
            )
        default:
            return (<></>)
    }
}