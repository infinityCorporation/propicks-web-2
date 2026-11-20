import React from "react";
import { team_data } from "../team-data/teamdata";

export const getTeamLogo = (team_name, size) => {
    const formatted_name = team_name.replaceAll(" ", "").toLowerCase();

    const filtered_array = team_data.filter((team) => team.team_code == formatted_name)

    if (filtered_array.length > 0) {
        return(
            <>
                <img src={filtered_array[0].team_logo} height={size} width={size} style={{borderRadius: 7}}/>
            </>
        )
    }
};
