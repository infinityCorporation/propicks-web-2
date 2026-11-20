import React, { useState } from 'react';

import { openChat } from '../utilities/openchat.js';
import { likePost } from '../utilities/likepost.js';
import { savePost } from '../utilities/savepost.js';
import { openProfile } from '../utilities/openprofile.js';
import { getRelativeTime } from '../utilities/timedistance.js';
import { flagPost } from './flagpost.js';
import { deletePost } from './deletepost.js';
import AttachmentModule from '../components/AttachmentModule.js';

import like from '../assets/heart.png';
import liked from '../assets/red_heart.png';
import comment from '../assets/reply.png';
import share from '../assets/share.png';
import bookmark from '../assets/save.png';
import saved from '../assets/check.png';
import more from '../assets/more.png';
import trash from '../assets/trash.png';
import flag from '../assets/flag.png';
import verified from '../assets/verified.png';
import PollComponent from '../components/PollComponent.js';

export const MainPostDisplay = ({ 
        post, 
        navigate, 
        setPosts, 
        user, 
        setUser, 
        checkUserStatus, 
        setShareScreen, 
        setMainBlurred, 
        mainBlurred, 
        setSharedPostId, 
        setBetInfoBool, 
        setBetObject, 
        setBetPostId, 
        setBetInfoType, 
        refresh_hook, 
        setSignUpCTA, 
        setAttachmentBool 
    }) => {
    const [optionsPanel, setOptionsPanel] = useState(false);
    const [overlayPanel, setOverlayPanel] = useState(false);
   
    try {
        const standard = "https://firebasestorage.googleapis.com/v0/b/propicksio.firebasestorage.app/o/defaultProfilePicture%2Fuser_pfp.jpg?alt=media&token=71272afc-3c7b-4d62-8c0d-2c2357be4207";

        return (
            <>
            <div className='user-post-container' key={post.message_id}>
                <div className='post-header-container'>
                    <img src={post.user_pfp ? post.user_pfp : standard} width="32" height="32" />
                    <div className='post-user-info'>
                        { post.user_verified ? 
                            <div className='verified-user-group' >
                                <p className='post-username-dash verified' onClick={() => {openProfile(post.user_gid, navigate)}}>{post.user_name}</p> 
                                <img src={verified} height="18" width="18" />
                            </div>
                            : 
                            <p className='post-username-dash' onClick={() => {openProfile(post.user_gid, navigate)}}>{post.user_name}</p>
                        }
                        <p className="forum-name-link" onClick={() => { /* openForum(post.chat_stream_id, post.forum_name, navigate) */ }}><span className='forum-name-span' >in</span> {post.forum_name}</p>
                    </div>
                </div>
                <div className='post-content' onClick={() => {openChat(post.message_id, navigate)}}>
                    <p>{post.message_data}</p>
                </div>
                { post.attachment_type == 'poll' || post.attached_bet_type == 'poll' ? (
                    <PollComponent 
                        poll_id={post.attached_poll} 
                        user_id={user.gid} 
                        setMainBlurred={setMainBlurred}
                        setSignUpCTA={setSignUpCTA}
                    />
                ) : (
                <AttachmentModule 
                    post={post} 
                    navigate={navigate} 
                    setBetObject={setBetObject} 
                    setBetPostId={setBetPostId}
                    setMainBlurred={setMainBlurred}
                    setBetInfoBool={setBetInfoBool} 
                    setBetInfoType={setBetInfoType}
                    setAttachmentBool={setAttachmentBool}
                />
                )}
                <div className='post-bottom-container' >
                    <div className='post-buttons-container'>
                        <div className='interact-button' onClick={() => {
                                likePost(post.message_id, post.user_gid, setPosts, user, setUser, checkUserStatus);
                            }}  >
                            <img src={post.is_liked ? liked : like} height="16" width="16" />
                            <p>{post.like_count}</p>
                        </div>
                        <div className='interact-button' onClick={() => {openChat(post.message_id, navigate)}} >
                            <img src={comment} height="16" width="16" onClick={() => {checkUserStatus()}} />
                            <p>{post.comment_count}</p>
                        </div>
                        <div className='interact-button' onClick={() => {
                                setShareScreen(true);
                                setMainBlurred(!mainBlurred);
                                setSharedPostId(post.message_id);
                            }} >
                            <img src={share} height="16" width="16" />
                            <p>Share</p>
                        </div>
                        <div className='interact-button' onClick={() => {savePost(post.message_id, setPosts, user, setUser, checkUserStatus)}} >
                            <img src={ post.is_saved ? saved : bookmark } height="16" width="16" />
                            <p>{ post.is_saved ? "Saved" : "Save" }</p>
                        </div>
                        <div className='interact-button creation-date post-shrink-group-second' >
                            <p>{getRelativeTime(post.post_date)}</p>
                        </div>
                    </div>
                    <div className='post-more-container post-shrink-group-first'>
                        <div className='post-more-button' onClick={() => {
                            setOptionsPanel(!optionsPanel)
                            setOverlayPanel(true);
                        }} >
                            <img src={more} height="18" width="18" />
                        </div>
                        { optionsPanel ? (<>
                            <div className={`${ optionsPanel ? "options-container-panel" : "hidden"}`} onClick={(e) => {e.stopPropagation()}}>
                                { user.gid == post.user_gid ? (<>
                                    <div className='delete-post-button' onClick={(e) => {
                                        e.stopPropagation();
                                        deletePost(post.message_id, post.user_gid, refresh_hook);
                                        setOptionsPanel(false);
                                        setOverlayPanel(false);
                                    }}>
                                        <img src={trash} height="18" width="18" />
                                        <p>Delete Post</p>
                                    </div>
                                </>) : (<></>)}
                                <div className='report-post-button' onClick={(e) => {
                                    e.stopPropagation();
                                    flagPost(post.message_id, post.user_gid, post.message_data, "This post has been flagged as offensive. Full reason not yet available.");
                                    setOptionsPanel(false);
                                    setOverlayPanel(false);
                                }}>
                                    <img src={flag} height="18" width="18" />
                                    <p>Report Post</p>
                                </div>
                            </div>
                        </>) : (<></>)}
                    </div>
                </div>
            </div>
            <div className={ overlayPanel ? "options-overlay-wrapper" : "hidden"} >
                <div
                    className="click-catcher"
                    onClick={() => {
                        setOptionsPanel(false);
                        setOverlayPanel(false);
                    }}
                />
            </div>
            </>
        )
    } catch (err) { 
        console.log(post);
        console.log({ err: err.message }) }
}