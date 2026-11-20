import { openChat } from '../utilities/openchat.js';
import { likePost } from '../utilities/likepost.js';
import { savePost } from '../utilities/savepost.js';
import { openProfile } from '../utilities/openprofile.js';
import { getRelativeTime } from '../utilities/timedistance.js';
import AttachmentModule from '../components/AttachmentModule.js';

import like from '../assets/heart.png';
import liked from '../assets/red_heart.png';
import comment from '../assets/reply.png';
import share from '../assets/share.png';
import bookmark from '../assets/save.png';
import saved from '../assets/check.png';
import verified from '../assets/verified.png';

export const ReplyPostDisplay = ({ post, navigate, setPosts, user, setUser, checkUserStatus, setShareScreen, setMainBlurred, mainBlurred, setSharedPostId, setBetPostId, setBetObject, setBetInfoBool, setBetInfoType }) => {
    try {
        let bet_line_exists = false, unformatted_bet_line, bet_line;
        const standard = "https://firebasestorage.googleapis.com/v0/b/propicksio.firebasestorage.app/o/defaultProfilePicture%2Fuser_pfp.jpg?alt=media&token=71272afc-3c7b-4d62-8c0d-2c2357be4207";

        let formatted_time;

        if(post.betting_line){
            if (Object.keys(JSON.parse(post.betting_line)).length > 0) {
                unformatted_bet_line = post.betting_line;
                bet_line = JSON.parse(post.betting_line);
                bet_line_exists = true;

                const date = new Date(bet_line.commence_time);

                formatted_time = new Intl.DateTimeFormat('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
                }).format(date);
            }
        }


        return (
            <div className='post-reply-container reply-margin' key={post.message_id}>
                <div className='post-reply-top'>
                    <img src={post.user_pfp ? post.user_pfp : standard} width="32" height="32" />
                    <div className='post-user-info'>
                        { post.user_verified ? 
                            <div className='verified-user-group' >
                                <p className='post-username-dash verified' onClick={() => {openProfile(post.user_gid, navigate)}}>{post.user_name}</p> 
                                <img src={verified} height="18" width="18" />
                            </div>
                            : 
                            <p className='post-reply-top-p' onClick={() => {openProfile(post.user_gid, navigate)}}>{post.user_name}</p>
                        }
                        <p className="forum-name-link" onClick={() => { /* openForum(post.chat_stream_id, post.forum_name, navigate) */ }}><span className='forum-name-span' >in</span> {post.forum_name}</p>
                    </div>
                </div>
                <div className='post-reply-content' onClick={() => {openChat(post.message_id, navigate)}}>
                    <p>{post.message_data}</p>
                </div>
                <AttachmentModule 
                    post={post} 
                    navigate={navigate} 
                    setBetObject={setBetObject} 
                    setBetPostId={setBetPostId}
                    setMainBlurred={setMainBlurred}
                    setBetInfoBool={setBetInfoBool} 
                    setBetInfoType={setBetInfoType}
                />
                <div className='post-buttons-container test-chat-buttons'>
                    <div className='interact-button' >
                        <img src={post.is_liked ? liked : like} height="16" width="16" onClick={() => {
                            console.log(post.user_gid)
                            likePost(post.message_id, post.user_gid, setPosts, user, setUser, checkUserStatus);
                        }} />
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
                    <div className='interact-button creation-date' >
                        <p>{getRelativeTime(post.post_date)}</p>
                    </div>
                </div>
            </div>
        )
    } catch (err) { console.log({ err: err.message }) }
}