import { getTeamLogo } from "./getteamlogo";
import { auditBetKey } from './auditkey';
import { getFirstThreeCaps } from "./createshortname";

export const ScannerCell = ({ line, event }) => {
    return(
        <>
            {
                line.outcomes.map((outcome) => {
                    return(
                        <>
                            <div className='book-line-display'>
                                { outcome.point ? (<>
                                    <p className='book-line-price'>{outcome.point}</p>
                                    <div className="book-price-with-name">
                                        <p className="book-line-price bold-price">{outcome.price}</p>
                                        <div className='book-line-name' >
                                            {getTeamLogo(outcome.name, 24)}
                                            <p className={`short-name ${ (outcome.name == "Over" || outcome.name == "Under") ? "extra-space": "" }`}>{getFirstThreeCaps(outcome.name)}</p>
                                        </div>
                                    </div>
                                </>) : (<>
                                    <p className='book-line-price bold-price'>{outcome.price}</p>
                                    <div className='book-line-name-no-point' >
                                        {getTeamLogo(outcome.name, 24)}
                                        <p>{ event.sport_key == "MMA" ? outcome.name : getFirstThreeCaps(outcome.name)}</p>
                                    </div>
                                </>)}
                            </div>
                        </>
                    )
                })
            }
            <div className="book-line-display" >
                <p></p>
                <p className="bet-type-scanner" >{auditBetKey(event.bet_key)}</p>
            </div>
        </>
    )
}