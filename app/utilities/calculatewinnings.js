export const calculatePayout = (odds, wager) => {
  let profit;

  if (odds > 0) profit = wager * (odds / 100);
  else profit = wager * (100 / Math.abs(odds));

  return wager + profit; 
};