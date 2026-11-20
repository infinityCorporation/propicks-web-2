With parlays, all that is required it the event name, the two teams, the outcomes, and the commence_time. However, outcomes will have to be tweaked a bit to include the sports
book that the bet is from.

Or arguably just make the parlay for a single book rather than across books

Parlay_object = {
    user_id,
    user_email,
    parlay_id,
    update_time,
    total_price,
    outcomes: [
        {
            bet_book,
            event,
            home_team,
            away_team,
            outcome: {
                outcome_name,
                outcome_points?,
                outcome_price
            }
        },
        {...}
    ]
}

These objects can include multiple games, player props, and should be held in a seperate parlay table rather than linking to changing bet outcomes and updating tables