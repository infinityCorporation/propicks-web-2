import React from 'react';
import './component-styles/sharescreen.css';

import { shareToTwitter } from '../utilities/twittershare';
import { shareToReddit } from '../utilities/redditshare';
import { shareToFacebook } from '../utilities/facebookshare';
import { copyToClipboard } from '../utilities/clipboardCopy';

import x from '../assets/x.png';
import reddit from '../assets/reddit.png';
import facebook from '../assets/facebook.png';
import link from '../assets/link.png';

export default function ShareScreen({ shareScreen, sharedPostId }: any) {
    return (
        <div className={`${shareScreen ? "share-screen" : "not-shown"}`} >
            <div className='share-header' >
                <p>Share To</p> 
            </div>
            <div className='share-buttons-container-dash'>
                <div className='x-share-button share-buttons-social' onClick={() => {shareToTwitter("Check out this post on ProPicks!", `https://propicks.io/test-chat?id=${sharedPostId}`)}}>
                    <img src={x} height="64" width="64" />
                    <p>X</p>
                </div>
                <div className='reddit-share-button share-buttons-social' onClick={() => {shareToReddit("Check out this post!", `https://propicks.io/test-chat?id=${sharedPostId}`)}}>
                    <img src={reddit} height="64" width="64" />
                    <p>Reddit</p>
                </div>
                <div className='x-share-button share-buttons-social share-mobile-hide' onClick={() => {shareToFacebook(`https://propicks.io/test-chat?id=${sharedPostId}`)}}>
                    <img src={facebook} height="64" width="64" />
                    <p>Facebook</p>
                </div>
            </div>
            <div className='link-button' onClick={() => {
                copyToClipboard(`https://propicks.io/test-chat?id=${sharedPostId}`);
                alert("Link Copied!");
            }} >
                <p>Copy Link</p>
                <img src={link} height="18" width="18" />
            </div>
        </div>
    )
}