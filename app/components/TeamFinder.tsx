import React, { useState } from 'react';
import './component-styles/teamfinder.css';

import { searchTeams } from '../utilities/searchteams';
import { handleKeyDown } from '../utilities/handlekeydown';
import { handleInput } from '../utilities/handleinput';

import search from '../assets/search.png';
import exit from '../assets/exit.png';

export default function TeamFinder({ teamFinderOpen, setMainBlurred, setTeamFinderOpen, setBetFinderOpen, setSignUpCTA, setForumSelected, teamSelected, setTeamSelected, mainBlurred }: any) {
    const [teamSearch, setTeamSearch] = useState("");
    const [teamResponse, setTeamResponse] = useState([]);
    
    return(
        <div className={`${teamFinderOpen ? "team-finder-container mobile-team-finder" : "not-shown"}`} >
            <div className='search-container-top'>
                <div className='team-search-title-container' >
                    <p>Attach Team Forum</p>
                    <img src={exit} height="16" width="16" onClick={() => {
                        setMainBlurred(false);
                        setBetFinderOpen(false);
                        setTeamFinderOpen(false);
                        setSignUpCTA(false);
                    }} />
                </div>
                <div className='top-search-container' >
                    <div className='search-container-dash'>
                        <img src={search} height="18" width="18" />
                        <textarea className='search-input' placeholder='Search' onChange={(e) => {handleInput(e, setTeamSearch)}} onKeyDown={(e) => handleKeyDown(e, () => searchTeams(teamSearch, setTeamResponse))} />
                    </div>
                    <div className='dash-search-button' onClick={() => {searchTeams(teamSearch, setTeamResponse)}} >
                        <p>Search</p>
                    </div>
                </div>
                
            </div>
            <div className='search-results-container' >
                {
                    teamResponse.map((team: any) => {
                        return(
                            <div className={`team-search-result ${teamSelected.team_id.includes(team.team_id) ? "selected-team" : ""}`} onClick={() => {
                                setTeamSelected({team_id: team.team_id, team_name: team.team_name});
                            }} >
                                <p>{team.team_name}</p>
                            </div>
                        )
                    })
                }
            </div>
            <div className='search-container-bottom'>
                <div className='dash-add-button team-cancel' onClick={() => {
                    setMainBlurred(false);
                    setBetFinderOpen(false);
                    setTeamFinderOpen(false);
                    setSignUpCTA(false);
                }} >
                    <p>Cancel</p>
                </div>
                <div className='dash-add-button' onClick={() => {
                    setForumSelected({ team_id: teamSelected.team_id, team_name: teamSelected.team_name });
                    setMainBlurred(!mainBlurred);
                    setBetFinderOpen(false);
                    setTeamFinderOpen(false);
                    setSignUpCTA(false);
                }}>
                    <p>Add Team</p>
                </div>
            </div>
        </div>
    )
}