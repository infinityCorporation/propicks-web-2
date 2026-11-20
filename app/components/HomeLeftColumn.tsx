import React, { useState, useEffect } from 'react';
import './component-styles/homeleftcolumn.css';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { openProfile } from '../utilities/openprofile';
import AdSense from 'react-adsense';
import axios from 'axios'

export default function HomeLeftColumn({ isInChat }) {
    const navigate = useNavigate();
    const auth = getAuth();
    const standard = "https://firebasestorage.googleapis.com/v0/b/propicksio.firebasestorage.app/o/defaultProfilePicture%2Fuser_pfp.jpg?alt=media&token=71272afc-3c7b-4d62-8c0d-2c2357be4207";

    const [userExists, setUserExists] = useState(false);

    const adHeight = isInChat ? 600 : 200;

    const top_users_data = [
        {
            pfp: "https://firebasestorage.googleapis.com/v0/b/propicksio.firebasestorage.app/o/profilePictures%2FeVCB9oeY0acrJFWDV40wIVr76g72?alt=media&token=59b09c5d-d099-4f9f-8347-a77cd09c7c1a",
            username: "danieljames21",
            gid: "eVCB9oeY0acrJFWDV40wIVr76g72",
            winnings: "$2,491.53",
            place: 1,
        },
        {
            pfp: "https://firebasestorage.googleapis.com/v0/b/propicksio.firebasestorage.app/o/profilePictures%2FMFmHf9jfGzayIOz9vlLoEKQv05N2?alt=media&token=3e998c1e-0ed3-4a23-9342-e7c2c90ae744",
            username: "morpheus22",
            gid: "MFmHf9jfGzayIOz9vlLoEKQv05N2",
            winnings: "$2,074.10",
            place: 2,
        },
        {
            pfp: "https://firebasestorage.googleapis.com/v0/b/propicksio.firebasestorage.app/o/profilePictures%2FATHNIEa3ADXQLTRJjo3wOfeRHV73?alt=media&token=c40e89ae-fa6c-4133-8ba4-8bda6fedcb55",
            username: "j.smith7",
            gid: "ATHNIEa3ADXQLTRJjo3wOfeRHV73",
            winnings: "$1,714.25",
            place: 3,
        },
        {
            pfp: "https://firebasestorage.googleapis.com/v0/b/propicksio.firebasestorage.app/o/profilePictures%2FVq8djihFl1NbI5cq23c6ordv2ZM2?alt=media&token=38eb09d7-77ab-442c-98b0-b5688761dd2b",
            username: "LayTheHouse",
            gid: "Vq8djihFl1NbI5cq23c6ordv2ZM2",
            winnings: "$983.07",
            place: 4,
        },
        {
            pfp: "https://firebasestorage.googleapis.com/v0/b/propicksio.firebasestorage.app/o/profilePictures%2FXScPwTe2bVfIWd6sI5z0jzC3zpA2?alt=media&token=74c9548a-4183-4cc7-bf9b-e5c990b08a28",
            username: "coleworld420",
            gid: "XScPwTe2bVfIWd6sI5z0jzC3zpA2",
            winnings: "$681.76",
            place: 5,
        },
    ];

    // useEffect to get user details
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) setUserExists(true);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div>
            <div id='left-column-container'>
                { /*}
                <div className={`new-user-info-container ${ !userExists ? 'left-cta-shown' : 'hidden'}`} >
                    <p className='new-user-info-title' >New to ProPicks?</p>
                    <p className='new-user-info-subtitle' >Get access to industry leading tools for Arbitrage betting, +EV betting, and Sportsbook scanning. For free, you can sign up to join our community of sports betting enthusiasts!</p>
                    <div className='left-sign-up-button' onClick={() => {navigate("/test-signup")}}>
                        <p>Sign Up For Free</p>
                    </div>
                    {/*
                    <div className='left-sign-up-button google-button' >
                        <p>Continue with Google</p>
                    </div>
                    
                    <div className='left-sign-in' onClick={() => {navigate("/test-signin")}}>
                        <p>Log In to Existing Account</p>
                    </div>
                </div>
                <div className={`new-user-info-container ${ (userExists && userTier == 0) ? 'left-cta-shown' : 'hidden'}`} >
                    <p className='new-user-info-title' >Welcome to ProPicks!</p>
                    <p className='new-user-info-subtitle slightly-bigger' >Upgrade your plan now for access to industry leading tools for Arbitrage, +EV, and Odds scanning. Start now with 1 month for free to make sure our tools work for you!</p>
                    <div className='left-sign-up-button extra-space-hl' onClick={() => {navigate("/test-checkout")}}>
                        <p>Upgrade For Free!</p>
                    </div>
                </div>
                {/*
                <div className={`arbitrage-winners-column ${ !userExists ? "" : "winner-top-display"} ${ isInChat ? "hidden" : ""}`} >
                    <p className='new-user-info-title' >Bet Profit Leaderboard</p>
                    <p className='new-user-info-subtitle leaderboard' >This leaderboard shows the users winning the most with ProPicks Arbitrage and +EV Tools.</p>
                    {
                        top_users_data.map((winner) => {
                            return(
                                <div className={`winner-row ${ winner.place == 5 ? 'last-place' : ""} ${ winner.place == 1 ? "first-place" : ""}`} key={winner.place} >
                                    <div className='winner-name' >
                                        <p className={ winner.place == 1 ? "first-place-label" : "standard-comp-label"}>{winner.place}</p>
                                        <img src={winner.pfp} height="22" width="22" />
                                        <p className='standard-comp-label' onClick={() => {openProfile(winner.gid, navigate)}}>{winner.username}</p>
                                    </div>
                                    <p className={ winner.place == 1 ? "first-place-label" : "standard-comp-label"} >{winner.winnings}</p>
                                </div>
                            )
                        })
                    }
                    <p className='new-user-info-subtitle contact-info' >To join the competition, send your earnings (and username) to team@propicks.io!</p>
                </div>
                */}
                <div className={`main-dash-ad-frame ${ !userExists ? "main-dash-ad-frame" : "main-dash-ad-frame" /* TOGGLE HERE FOR AD FRAME */ }`} style={{ height: adHeight }}>
                    <AdSense.Google client="ca-pub-8494015050743005" slot="6856315638" style={{ width: 266, height: adHeight }} format='' />
                </div>
            </div>
        </div>
    )
}