// This should be a component...

import { useState, useEffect } from 'react';
import { getBookLogo } from '../events';
import { auditBetBook } from '../audits';
import { auditBetPercent } from '../audits';
import { getTeamLogo } from '../events';
import { auditBetKey } from '../audits';

import calendar from '../assets/calendar.png';

export const ArbitrageRow = ({ bet, columns }: any) => {
  let formattedTime;

  const date = new Date(bet.commence_time);

  formattedTime = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(date);

  // Original base stakes from your arbitrage calculation
  const basePositive = parseFloat(String(bet.positive_play_stake * 100));  // e.g. 1
  const baseNegative = parseFloat(String(bet.negative_play_stake * 100));  // e.g. 2.61

  // Ratio of negative stake to positive stake
  const stakeRatio = baseNegative / basePositive;

  // State values for the current user-input stakes
  const [positiveStake, setPositiveStake] = useState(basePositive.toFixed(2));
  const [negativeStake, setNegativeStake] = useState(baseNegative.toFixed(2));
  const [profit, setProfit] = useState(0);

  // When the positive stake changes, recalculate the negative side
  const handlePositiveChange = (e: any) => {
    const input = e.target.value;
    setPositiveStake(input);

    const parsed = parseFloat(input);
    if (!isNaN(parsed)) {
      setNegativeStake((parsed * stakeRatio).toFixed(2));
    } else {
      setNegativeStake('');
    }
  };

  const handleNegativeChange = (e: any) => {
    const input = e.target.value;
    setNegativeStake(input);

    const parsed = parseFloat(input);
    if (!isNaN(parsed)) {
      const newPositive = parsed / stakeRatio;
      setPositiveStake(newPositive.toFixed(2));
    } else {
      setPositiveStake('');
    }
  };

  const calculateProfit = () => {
    const p_stake = Number(positiveStake);
    const n_stake = Number(negativeStake);
    const win_perc = Number(auditBetPercent(bet.arbitrage_percentage));

    let cost = p_stake + n_stake;
    let rev = (cost * (win_perc / 100)) + cost;

    const profit = rev - cost;
    const result: number = Number(auditBetPercent(profit));

    setProfit(result);
  };

  const handleColumnChange = (name: any) => {
    if (columns.length > 3) {
        if (columns.includes(name)) return "";
        else return "hidden";
    } else return "";
  }

  useEffect(() => {
    calculateProfit()
  }, [negativeStake, positiveStake])

  return (
    <>
      <td className={`left-edge ${handleColumnChange("arbitrage_percentage")}`} ><span className='percentage'>+{auditBetPercent(bet.arbitrage_percentage)}%</span></td>
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
        <td className={`middle ${handleColumnChange("positive_play")}`} >
            <div className='arb-play-container' >
                <div className='bet-price-container' >
                    <p>{bet.positive_play_price > 0 ? `+${bet.positive_play_price}` : `${bet.positive_play_price}`}</p>
                </div>
                <div className='arb-one-side-container' >
                    <div className='arb-play-team-container' >
                      {getTeamLogo(bet.positive_play_name, 24)}
                      <p>{bet.positive_play_name}</p>
                    </div>
                    {/*}
                    <div className='arb-play-book-container' >
                      <img src={getBookLogo(auditBetBook(bet.positive_play_book))} height="22" width="22" />
                      <p>{auditBetBook(bet.positive_play_book)}</p>  
                    </div>
                    */}
                    <div className='arb-play-book-container arb-bet-type-color' >
                      <p>{auditBetKey(bet.bet_type)}</p>
                    </div>
                </div>
            </div>
        </td>
        <td className='middle' >
          <div className='arb-play-book-content' >
            <div className='arb-play-book-container book-margin' >
              <img src={getBookLogo(auditBetBook(bet.positive_play_book))} height="21" width="21" />
              <p>{auditBetBook(bet.positive_play_book)}</p>  
            </div>
            {/*}
            <div className='arb-play-book-button' >
              <img src={arrow} width="18" height="18" />
              <p>Bet Now</p>
            </div>
            */}
          </div>
        </td>
        <td className={`middle ${handleColumnChange("positive_size")}`} >
            <div className='arb-size-container' >
                <p>$</p>
                <textarea 
                    placeholder={String(basePositive)}
                    className='arb-bet-sizing'
                    value={positiveStake}
                    onChange={handlePositiveChange}
                />
            </div>
        </td>
        <td className={`middle ${handleColumnChange("negative_play")}`} >
        <div className='arb-play-container' >
                <div className='bet-price-container' >
                    <p>{bet.negative_play_price > 0 ? `+${bet.negative_play_price}` : `${bet.negative_play_price}`}</p>
                </div>
                <div className='arb-one-side-container' >
                    <div className='arb-play-team-container' >
                      {getTeamLogo(bet.negative_play_name, 24)}
                      <p>{bet.negative_play_name}</p>
                    </div>
                    {/*
                    <div className='arb-play-book-container' >
                      <img src={getBookLogo(auditBetBook(bet.negative_play_book))} height="22" width="22" />
                      <p>{auditBetBook(bet.negative_play_book)}</p>  
                    </div>
                    */}
                    <div className='arb-play-book-container arb-bet-type-color' >
                      <p>{auditBetKey(bet.bet_type)}</p>
                    </div>
                </div>
            </div>
        </td>
        <td className='middle' >
          <div className='arb-play-book-content' >
            <div className='arb-play-book-container book-margin' >
              <img src={getBookLogo(auditBetBook(bet.negative_play_book))} height="21" width="21" />
              <p>{auditBetBook(bet.negative_play_book)}</p>  
            </div>
            {/*}
            <div className='arb-play-book-button' >
              <img src={arrow} width="18" height="18" />
              <p>Bet Now</p>
            </div>
            */}
          </div>
        </td>
        <td className={`middle ${handleColumnChange("negative_size")}`} >
            <div className='arb-size-container' >
                <p>$</p>
                <textarea 
                    placeholder={String(baseNegative)}
                    className='arb-bet-sizing'
                    value={negativeStake}
                    onChange={handleNegativeChange}
                />
            </div>
        </td>
        <td className={`middle ${handleColumnChange("profit_estimate")}`} >${profit}</td>
    </>
  );
};
