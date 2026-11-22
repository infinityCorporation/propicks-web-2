import { auditBetBook } from "./audits"
import { getBookLogo } from "./events"

export const OddsModule = ({ odds, setBetInfoBool, setBetObject, setMainBlurred, bet_type, setBetInfoType }: any) => {

    if (odds.length == 0) {
        return (
            <></>
        )
    }

    return(
        <div className='game-avg-container' >
            { odds.length == 0 ? (<></>) : (<><p className='odds-title' >{bet_type}</p></>) }
            <div className="game-total-lines-container">
                {
                    odds.map((line: any) => {
                        return(
                            <div className='game-line-container' onClick={() => {
                                setBetInfoBool(true);
                                setMainBlurred(true);
                                setBetObject(line);
                                setBetInfoType('bet');
                            }}>
                                <div className="game-book-container">
                                    <img src={getBookLogo(line.book)} height="24" width="24" style={{borderRadius: '50%'}} />
                                    <p>{auditBetBook(line.book)}</p>
                                </div>
                                {
                                    line.outcomes.map((outcome: any) => {
                                        return(
                                            <div className="game-outcome-container" >
                                                <p>{outcome.name} { outcome.point ? outcome.point : "" }</p>
                                                <p>{outcome.price}</p>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}