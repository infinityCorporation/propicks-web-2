import { useState, useEffect } from 'react';
import { auditBetKey } from './auditkey';
import { getBookLogo } from './getbooklogo';
import { auditBetBook } from './auditbook';
import { auditBetPercent } from './auditbetpercent';
import { getTeamLogo } from './getteamlogo';

import calendar from '../assets/calendar.png';

export const PevRow = ({ bet, columns }) => {
  let formattedTime;

  const date = new Date(bet.commence_time);

  formattedTime = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(date);

  const [profit, setProfit] = useState(0);
  const [revenue, setRevenue] = useState(0);

  const [betSize, setBetSize] = useState(auditBetPercent(1));
  const [baseSize, setBaseSize] = useState(auditBetPercent(1));

  const handleColumnChange = (name) => {
    if (columns.length > 3) {
        if (columns.includes(name)) return "";
        else return "hidden";
    } else return "";
  };

  function convertProbabilityToAmericanOdds(probability) {
    console.log(probability)
    // Accept 0–1 or 0–100
    if (probability > 0 && probability < 1) {
      probability *= 100; // convert to percentage
    }
  
    if (probability <= 0 || probability >= 100) {
      throw new Error("Probability must be between 0 and 100 (exclusive).");
    }
  
    let americanOdds;
  
    if (probability < 50) {
      americanOdds = Math.round((100 / probability - 1) * 100);
      return `+${americanOdds}`;
    } else {
      americanOdds = Math.round(-(probability / (100 - probability)) * 100);
      return `${americanOdds}`;
    }
  }

  const handleBetSize = (e) => {
    setBetSize(e.target.value);
  };

  const calculateRevenue = () => {
    const perc = Number(bet.positive_play_percentage);
    const odds = Number(bet.positive_play_price);

    const size = betSize > 0 ? betSize : baseSize;

    if (odds > 0) {
        const rev = (Number(size) * (odds / 100)) + Number(size);
        setRevenue(auditBetPercent(rev));
    } else {
        const rev = (((100 / Math.abs(odds)) / 100) * Number(size)) + Number(size);
        setRevenue(auditBetPercent(rev));
    }

    const pro = (size * (perc / 100));
    setProfit(auditBetPercent(pro));
  };

  // Calculates the revenue when the user inputs a new betSize
  useEffect(() => {
    calculateRevenue();
  }, [betSize])

  return (
    <>
      <td className={`left-edge ${handleColumnChange("pev_percentage")}`} ><span className='percentage'>+{auditBetPercent(bet.positive_play_percentage)}%</span></td>
        {/*<td className={`middle ${handleColumnChange("sport")}`} >{bet.sport}</td>*/}
        <td className={`middle ${handleColumnChange("event")}`} >
            <div className='arb-event-container' >
                <p>{bet.home_team} vs. {bet.away_team}</p>
                <div className='arb-event-details' >
                    <img src={calendar} height="16" width="16" />
                    <p>{formattedTime} • {bet.sport}</p>
                </div>
            </div>
        </td>
        <td className={`middle ${handleColumnChange("pev_play")}`} >
            <div className='arb-play-container' >
                <div className='bet-price-container' >
                    <p>{bet.positive_play_price > 0 ? `+${bet.positive_play_price}` : `${bet.positive_play_price}`}</p>
                </div>
                <div className='arb-one-side-container' >
                    <div className='arb-play-team-container' >
                        {getTeamLogo(bet.positive_play_name, 24)}
                        <p>{bet.positive_play_name}</p>
                    </div>
                    <div className='arb-play-book-container arb-bet-type-color' >
                        <p>{auditBetKey(bet.bet_type)}</p>
                    </div>
                </div>
            </div>
        </td>
        <td className='middle book-cell' >
          <div className='arb-play-book-content' >
            <div className='arb-play-book-container book-margin' >
              <img src={getBookLogo(auditBetBook(bet.book))} height="21" width="21" />
              <p>{auditBetBook(bet.book)}</p>  
            </div>
          </div>
        </td>
        <td className={`middle avg-odds-cell ${handleColumnChange("avg_odds")}`} >{ Number(bet.positive_play_price) > 0 ? convertProbabilityToAmericanOdds(bet.avg_positive_vigged_probability) : convertProbabilityToAmericanOdds(bet.avg_negative_vigged_probability) }</td>
        <td className={`middle ${handleColumnChange("bet_sizing")}`} >
            <div className='arb-size-container' >
                <p>$</p>
                <textarea 
                    placeholder={baseSize}
                    className='arb-bet-sizing'
                    value={betSize}
                    onChange={handleBetSize}
                />
            </div>
        </td>
        <td className={`middle ${handleColumnChange("revenue")}`} >${revenue}</td>
        <td className={`middle ${handleColumnChange("average_probability")}`} >{bet.positive_play_price > 0 ? bet.avg_positive_vigged_probability : Math.abs(bet.avg_negative_vigged_probability)}%</td>
        <td className={`middle ${handleColumnChange("play_probability")}`} >{bet.pev_line_probability}%</td>
    </>
  );
};
