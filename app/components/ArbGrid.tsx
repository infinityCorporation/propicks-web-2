import React, { useEffect, useState } from 'react';
import './component-styles/arbgrid.css';
import { getTeamLogo } from '../utilities/getteamlogo';
import { formatGameDateParts } from '../utilities/dateformat';
import { getBookLogo } from '../utilities/getbooklogo';
import { auditBetBook } from '../utilities/auditbook';

export default function ArbGridComponent({ bet, setArbInfoOverlay, setBetInfoInspect, setBetInspectExists, setBlurShown, arbitrageBets, setArbitrageBets, setTotalProfit, calculateFromStake }) {    
    const [totalStake, setTotalStake] = useState("100.00");
    const [positiveStake, setPositiveStake] = useState(0);
    const [negativeStake, setNegativeStake] = useState(0);
    const [totalProfitComp, setTotalProfitComp] = useState(bet ? bet.arbitrage_percentage : 0);

    const isPlayerProp = (key) => {
        if (key == 'h2h' || key == 'spreads' || key == 'totals') return false;
        else return true;
    };

    const calcStake = (stake) => {
        const stakeSize = stake * 100;

        return stakeSize.toFixed(2);
    };

    const calculateFromStakeComp = (newStake, arb_percent, positive_stake, negative_stake) => {
        setTotalStake(Number(newStake));

        const newProfit = Number(newStake) * (Number(arb_percent) / 100)
        setTotalProfitComp(newProfit.toFixed(2));

        const total_factor = Number(positive_stake) + Number(negative_stake);

        const pos_percent_factor = Number(positive_stake) / total_factor;
        const neg_percent_factor = Number(negative_stake) / total_factor;

        const pos_bet_size = Number(newStake) * pos_percent_factor;
        const neg_bet_size = Number(newStake) * neg_percent_factor;

        setPositiveStake(Number(pos_bet_size));
        setNegativeStake(Number(neg_bet_size));
    };

    const removeBet = (bet) => {
        const newArray = arbitrageBets.filter(arbBet => arbBet.uid !== bet.uid);
        setArbitrageBets(newArray);
    };

    useEffect(() => {
        calculateFromStakeComp(100, bet.arbitrage_percentage, bet.positive_play_stake, bet.negative_play_stake);
    }, []);

    const commenceTime = bet.commence_time ? formatGameDateParts(bet.commence_time) : {dayPart: "", timePart: ""};

    return (
        <div className='arb-grid-container' onClick={() => {
            setArbInfoOverlay(true);
            setBlurShown(true);
            setBetInfoInspect(bet);
            setBetInspectExists(true);

            setTotalProfit(totalProfitComp)
        }}>
            <div className='arb-grid-event-title-group' >
                <div className='arb-grid-event-info'>
                    <p className='arb-grid-event-name' >{bet.event}</p>
                    <p className='arb-grid-event-time' >{commenceTime.dayPart} @ {commenceTime.timePart}</p>
                </div>
                <div className='arb-grid-event-percent' >
                    <p>+{bet.arbitrage_percentage}%</p>
                </div>
            </div>
            <div className='arb-grid-bet-details' >
                <div className='grid-bet-side' >
                    <div className='grid-bet-side-header-group' >
                        <div className='grid-bet-size-book' >
                            <img src={getBookLogo(bet.positive_play_book)} height="26" width="26" />
                            <p>{auditBetBook(bet.positive_play_book)}</p>
                        </div>
                        <div className='grid-bet-side-price' >
                            <p>{bet.positive_play_price > 0 ? `+${bet.positive_play_price}` : bet.positive_play_price }</p>
                        </div>
                    </div>
                    <p className='grid-bet-side-info' >{bet.positive_play_name}</p>
                    <div className='grid-side-size' >
                        <p>${positiveStake.toFixed(2)}</p>
                    </div>
                </div>
                <div className='grid-bet-side' >
                    <div className='grid-bet-side-header-group' >
                        <div className='grid-bet-size-book' >
                            <img src={getBookLogo(bet.negative_play_book)} height="26" width="26" />
                            <p>{auditBetBook(bet.negative_play_book)}</p>
                        </div>
                        <div className='grid-bet-side-price' >
                            <p>{bet.negative_play_price > 0 ? `+${bet.negative_play_price}` : bet.negative_play_price }</p>
                        </div>
                    </div>
                    <p className='grid-bet-side-info' >{bet.negative_play_name}</p>
                    <div className='grid-side-size' >
                        <p>${negativeStake.toFixed(2)}</p>
                    </div>
                </div>
            </div>
            <div className='arb-grid-bottom-group' onClick={(e) => {
                e.stopPropagation();
            }}>
                <div className='arb-grid-bottom-left'>
                    <div className='arb-grid-total'>
                        <p className='arb-grid-total-size'>Total Size: $</p>
                        <input className='arb-grid-total-size-input' placeholder="100.00" value={totalStake} onChange={(e) => {
                                calculateFromStakeComp(e.target.value, bet.arbitrage_percentage, bet.positive_play_stake, bet.negative_play_stake);
                            }}
                            onBlur={(e) => {setTotalStake(Number(e.target.value).toFixed(2))}}
                        />
                    </div>
                    <div className='arb-grid-winnings' >
                        <p>Total Profit: <span className='grid-winnings-span' >${totalProfitComp}</span></p>
                    </div>
                </div>
                <div className='arb-grid-bottom-right' >
                    <div className='arb-grid-see-more' onClick={() => {
                        setArbInfoOverlay(true);
                        setBlurShown(true);
                        setBetInfoInspect(bet);
                        setBetInspectExists(true);

                        setTotalProfit(totalProfitComp)
                    }}>
                        <p>See More</p>
                    </div>
                    <div className='arb-grid-remove-bet' onClick={() => {removeBet(bet)}}>
                        <p>Remove Bet</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
