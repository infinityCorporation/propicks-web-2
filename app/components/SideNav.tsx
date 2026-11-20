import React, { useState, useEffect, useCallback } from 'react';
import './component-styles/sidenav.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { sports_nav_data } from '../data/sportsnav';

import home from '../assets/home.png';
import arb from '../assets/arbitrage.png';
import pev from '../assets/pev.png';
import scanner from '../assets/scan.png';
import groups from '../assets/profile.png';
import plus from '../assets/plus.svg';

export default function SideNav({ navigate }: any) {
    const auth = getAuth();

    const [userExists, setUserExists] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) setUserExists(false);
            else setUserExists(true);
        });

        return () => unsubscribe();
    }, [])

    return (
        <div className='side-nav-container' >
            <div className='side-nav-group'>
                {
                    !userExists ? (<>
                        <div className='new-user-cta' >
                            <p>New here? Create an account for free!</p>
                            <button className='new-user-cta-button' onClick={() => navigate('/test-signup')}>
                                Sign Up Today
                            </button>
                        </div>
                    </>) : (<></>)
                }
                <p className='nav-group-header' >Main Menu</p>
                <div className='nav-group-button' onClick={() => {navigate('/')}}>
                    <img src={home} className='side-home-button' />
                    <p>Home</p>
                </div>
                <div className='nav-group-button' onClick={() => {navigate('/test-create')}} >
                    <img src={plus} className='side-home-button' />
                    <p>Create</p>
                </div>
                <div className='nav-group-button' onClick={() => {navigate('/test-groups')}} >
                    <img src={groups} className='side-home-button' />
                    <p>Groups</p>
                </div>
                {/* You can add a search/explore page here or something */}
            </div>
            <div className='side-nav-group' >
                <p className='nav-group-header' >Tools</p>
                <div className='nav-group-button' onClick={() => {navigate('/test-arbitrage')}} >
                    <img src={arb} className='side-home-button' />
                    <p>Arbitrage</p>
                </div>
                <div className='nav-group-button' onClick={() => {navigate('/test-pev')}} >
                    <img src={pev} className='side-home-button' />
                    <p>Positive EV</p>
                </div>
                <div className='nav-group-button' onClick={() => {navigate('/test-scanner')}} >
                    <img src={scanner} className='side-home-button' />
                    <p>Scanner</p>
                </div>
            </div>
            <div className='side-nav-group' >
                <p className='nav-group-header' >Sports</p>
                {
                    sports_nav_data.map((sport) => {
                        return (
                            <div className='nav-group-button' key={sport.sport_name} onClick={() => {navigate(`/test-sport?code=${sport.sport_code}`)}} >
                                <p>{sport.sport_name}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}