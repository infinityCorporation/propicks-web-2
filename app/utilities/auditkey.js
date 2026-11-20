export const auditBetKey = (bet_key) => {
    if(bet_key == 'h2h') return "Moneyline"
    else if (bet_key == "spreads") return "Spread"
    else if (bet_key == "totals") return "Totals"
    else return bet_key;
};