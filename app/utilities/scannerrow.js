import calendar from '../assets/calendar.png';

import { getTeamLogo } from './getteamlogo';
import { sportsbook_data } from '../data/bookdata';
import { ScannerCell } from './scannercell';
import { useNavigate } from 'react-router-dom';
import { getBookLogo } from './getbooklogo';
import { auditBetBook } from './auditbook';
import { getFirstThreeCaps } from './createshortname';



export const ScannerRow = ({ event, dataBlurred, selectedBooks }) => {
    const navigate = useNavigate();
    let formattedTime;
    
    const date = new Date(event.commence_time);

    formattedTime = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    }).format(date);

    return(
        <tbody className={dataBlurred ? `blur` : ``}>
            <tr onClick={() => {navigate(`/game?game_id=${event.event_id}`)}} >
                <td className='middle-scanner' >
                    <div className='arb-event-container' >
                        <div className='scan-event-team-container' >
                            {getTeamLogo(event.home_team, 28)}
                            <p>{event.home_team}</p>
                        </div>
                        <div className='scan-event-team-container' >
                            {getTeamLogo(event.away_team, 28)}
                            <p>{event.away_team}</p>
                        </div>
                        <div className='arb-event-details scanner-event-info' >
                            <img src={calendar} height="16" width="16" />
                            <p>{formattedTime} • {event.sport_key}</p>
                        </div>
                    </div>
                </td>
                <td className='middle' >
                    <div className='best-odds-cell'>
                        <div className='best-odds-row'>
                            <p>{event.best_odds.over.price} {getFirstThreeCaps(event.best_odds.over.name)}</p>
                            <img src={getBookLogo(auditBetBook(event.best_odds.over.book))} height="28" width="28" />
                        </div>
                        <div className='best-odds-row'>
                            <p>{event.best_odds.under.price} {getFirstThreeCaps(event.best_odds.under.name)}</p>
                            <img src={getBookLogo(auditBetBook(event.best_odds.under.book))} height="28" width="28" />
                        </div>
                    </div>
                </td>
                {
                    selectedBooks.length > 4 ? (
                        <> 
                            { sportsbook_data.filter((book) => selectedBooks.includes(book.book_code)).map((book) => {
                                const line = event.sorted_lines[book.book_code];
                                return (
                                    <td className="middle" key={book.book_code}>
                                        {line ? (
                                            <ScannerCell line={line} event={event} />
                                        ) : (<><p style={{textAlign: 'left'}}>N/A</p></>)}
                                    </td>
                                );
                            })}
                        </>
                ) : (
                    <>
                        {
                            sportsbook_data.map((book) => {
                                const line = event.sorted_lines[book.book_code];
                                return (
                                    <td className="middle" key={book.book_code}>
                                        {line ? (
                                            <ScannerCell line={line} event={event} />
                                        ) : (<><p style={{textAlign: 'left'}}>N/A</p></>)}
                                    </td>
                                );
                            })
                        }
                    </>
                )}
            </tr> 
        </tbody>
    )
}