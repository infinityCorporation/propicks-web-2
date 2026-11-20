import React, { useState, useEffect } from 'react';
import { useNavigate, useResolvedPath } from 'react-router-dom';
import "./component-styles/topbar.css";
import { onAuthStateChanged, getAuth, signOut } from 'firebase/auth';
import axios from 'axios';

import logo from '../assets/logo2.png';
import home from '../assets/home.png';
import arb from '../assets/arbitrage.png';
import pev from '../assets/pev.png';
import scanner from '../assets/scan.png';
import plans from '../assets/plans.png';
import notification_img from '../assets/bell.png';
import edit from '../assets/edit.png';
import help from '../assets/help.png';
import logout from '../assets/logout.png';
import settings from '../assets/settings.png';
import groups from '../assets/profile.png';
import no_notification from '../assets/no_notifications.png';
import search from '../assets/search.png';
import exit from '../assets/exit.png';
import tools from '../assets/tools1.png';
import tools_svg from '../assets/Icon.svg';


import { openChat } from '../utilities/openchat';
import { openProfile } from '../utilities/openprofile';
import { handleInput } from '../utilities/handleinput';
import { handleKeyDown } from '../utilities/handlekeydown';

export default function TopBar() {
    const standard = "https://firebasestorage.googleapis.com/v0/b/propicksio.firebasestorage.app/o/defaultProfilePicture%2Fuser_pfp.jpg?alt=media&token=71272afc-3c7b-4d62-8c0d-2c2357be4207";

    const [profilePopout, setProfilePopout] = useState(false);
    const [user, setUser] = useState({});
    const [userExists, setUserExists] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pfp, setPfp] = useState(standard);
    const [notifications, setNotifications] = useState([]);
    const [notificationsPopout, setNotificationsPopout] = useState(false);
    const [topBarBlur, setTopBarBlur] = useState(false);
    const [newNotifications, setNewNotifications] = useState(false);
    const [screenBlur, setScreenBlur] = useState(false);
    const [searchScreen, setSearchScreen] = useState(false);
    const [signUpCTA, setSignUpCTA] = useState(false);

    const [searchResult, setSearchResult] = useState([]);
    const [username, setUsername] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [userSearchResult, setUserSearchResult] = useState([]);
    const [gamesSearchResult, setGamesSearchResult] = useState([]);
    const [postsSearchResult, setPostsSearchResult] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    const navigate = useNavigate();
    const auth = getAuth();

    const logOutUser = () => {
        signOut(auth)
            .then(() => {
                setUserExists(false);
                setUser({});
                setPfp(standard);
                setProfilePopout(false);
                setTopBarBlur(false);

                sessionStorage.clear();

                navigate("/");
            })
            .catch((err) => {
                console.log({ err: err.message });
            })
    };

    const checkUserStatus = () => {
        if (!userExists) {
            setSignUpCTA(true);
            setScreenBlur(true);
            setSearchScreen(false);
            setNotificationsPopout(false);
            setProfilePopout(false);
            setTopBarBlur(false);
            return false;
        }
        return true;
    }

    const fetchUserProfile = async (gid) => {
        const session = sessionStorage.getItem("user-session-data");
        let user_session_data = null;

        try { user_session_data = session ? JSON.parse(session) : null; }
        catch (err) { sessionStorage.removeItem("user-session-data"); }

        if(user_session_data != null){
            setUser(user_session_data);
            setPfp(user_session_data.pfp);
            setUserExists(true);
            
            if(user_session_data.notifications.length > 0) {
                getNewNotifications(user_session_data.gid);
            }
        } else {
            const profile_response = await axios.post("https://propicks-data-api.com/v1/get-user", {
                gid: gid,
            })

            if(profile_response.status == 200){
                setUser(profile_response.data.user);
                setLoading(false);
                setUserExists(true);

                sessionStorage.setItem('user-session-data', JSON.stringify(profile_response.data.user));

                if(profile_response.data.user) setPfp(profile_response.data.user.pfp);
                if(profile_response.data.user.notifications.length > 0) getNotifications(profile_response.data.user.notifications);
            } else console.log({ err: "Call not succesful "})
        }
    };

    const getNotifications = async (notifications) => {
        try {
            const notifications_response = await axios.post("https://propicks-data-api.com/v1/get-notifications", {
                notifications: notifications,
            })

            if(notifications_response.status == 200) {
                setNotifications(notifications_response.data.notifications);

                notifications_response.data.notifications.forEach(notification => {
                    if(!notification.notification_seen) setNewNotifications(true);
                });
            }
        } catch (err) { console.log({ err: err.message }) };
    };

    const getNewNotifications = async (user_gid) => {
        try {
            const notifications_response = await axios.post("https://propicks-data-api.com/v1/get-new-notifications", {
                user_gid: user_gid,
            })

            if(notifications_response.status == 200) {
                setNotifications(notifications_response.data.notifications);

                notifications_response.data.notifications.forEach(notification => {
                    if(!notification.notification_seen) setNewNotifications(true);
                });
            }
        } catch (err) { console.log({ err: err.message }) };
    };

    const deleteNotification = async (notification_uid) => {
        try {
            const delete_response = await axios.post("https://propicks-data-api.com/v1/delete-notification", {
                notification_uid: notification_uid,
                gid: user.gid,
            });

            if(delete_response.status == 200){
                setNotifications(notifications => notifications.filter(notification => notification.notification_uid !== notification_uid));

                let updated_user = { ...user, notifications: [...user.notifications] };

                if(updated_user.notifications.includes(notification_uid)) updated_user.notifications.splice(updated_user.notifications.indexOf(notification_uid), 1);

                setUser(updated_user)
                sessionStorage.setItem('user-session-data', JSON.stringify(updated_user));
            }
        } catch (err) { console.log({ err: err.message }) };
    };

    const deleteNotificationWithProfile = async (notification_uid, updated_user) => {
        try {
            const delete_response = await axios.post("https://propicks-data-api.com/v1/delete-notification", {
                notification_uid: notification_uid,
                gid: user.gid,
            });

            if(delete_response.status == 200){
                setNotifications(notifications => notifications.filter(notification => notification.notification_uid !== notification_uid));

                if(updated_user.notifications.includes(notification_uid)) updated_user.notifications.splice(updated_user.notifications.indexOf(notification_uid), 1);

                setUser(updated_user)
                sessionStorage.setItem('user-session-data', JSON.stringify(updated_user));

                navigate("/test-groups");
            }
        } catch (err) { console.log({ err: err.message }) };
    };

    const joinGroup = async (group_uid, notification_uid) => {
        try {
            const group_response = await axios.post("https://propicks-data-api.com/v1/join-group", {
                group_uid: group_uid,
                user_gid: user.gid,
            })

            if (group_response.status == 200) {
                let updated_user = { ...user, groups: [...user.groups], notifications: [...user.notifications] };

                if(!updated_user.groups.includes(group_uid)) updated_user.groups.push(String(group_uid));

                setUser(updated_user);
                deleteNotificationWithProfile(notification_uid, updated_user);
            }
        } catch (err) { console.log({ err: err.message }) }
    };

    const setNotificationsSeen = async () => {
        const notification_uid_array = []

        notifications.forEach(notification => notification_uid_array.push(notification.notification_uid))

        try {
            const notifications_seen_response = await axios.post("https://propicks-data-api.com/v1/set-notifications-seen", {
                notifications: notification_uid_array,
            })

            if (notifications_seen_response.status == 200) setNewNotifications(false);
        } catch (err) { console.log({ err: err.message }) };
    };

    const followUser = async (userId) => {
        if (!checkUserStatus()) return;

        try {
            const follow_response = await axios.post("https://propicks-data-api.com/v1/follow-user", {
                gid: userId,
                follower_gid: user.gid,
                follower_pfp: user.pfp,
                follower_name: user.name,
            });

            if (follow_response.status == 200) {

                let updated_user = { ...user, user_following: [...user.user_following] };

                if (updated_user.user_following.includes(userId)) updated_user.user_following.splice(updated_user.user_following.indexOf(userId), 1);
                else updated_user.user_following.push(userId);

                setUser(updated_user);
                sessionStorage.setItem('user-session-data', JSON.stringify(updated_user));                
            }
        } catch (err) { console.log({ err: err.message }) };
    };

    const searchUsers = async () => {
        try {
            const user_search_response = await axios.post("https://propicks-data-api.com/v1/search-users", {
                username: username,
            })

            if (user_search_response.status == 200) setSearchResult(user_search_response.data.users);
        } catch (err) { console.log({ err: err.message })}
    };

    const getSearch = async () => {
        try {
            const search_response = await axios.post('https://propicks-data-api.com/v1/multi-search', {
                search_term: searchTerm,
            });

            if (search_response.status === 200) {
                setUserSearchResult(search_response.data.users);
                setPostsSearchResult(search_response.data.posts);
                setGamesSearchResult(search_response.data.games);
            }
        } catch (err) {
            console.log({ err: err.message })
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(user){
                fetchUserProfile(user.uid)
            }
        })

        return () => unsubscribe();
    }, [])

    return(
        <div className='topbar-content' >
            <div className='logo-container' onClick={() => navigate("/")}>
                <img src={logo} height="24" width="24" />
                <h4 className='propicks-title'>ProPicks</h4>
            </div>
            <div className='nav-container'>
                {/*}
                <div className='nav-button third-close-group' onClick={() => {navigate('/')}} >
                    <img src={home} height="20" width="20" />
                    <p className='nav-button-title' >Home</p>
                </div>
                <div className='home-divider' />
                {/*}
                <div className='nav-button second-close-group' onClick={() => {navigate('/test-groups')}} >
                    <img src={groups} height="20" width="20" />
                    <p className='nav-button-title' >Groups</p>
                </div>
                */}{/*}
                <div className='nav-button first-close-group' onClick={() => {navigate('/test-arbitrage')}} >
                    <img src={arb} height="20" width="20" />
                    <p className='nav-button-title' >Arbitrage</p>
                </div>
                <div className='nav-button first-close-group' onClick={() => {navigate('/test-pev')}} >
                    <img src={pev} height="20" width="20" />
                    <p className='nav-button-title' >Positive EV</p>
                </div>
                <div className='nav-button first-close-group' onClick={() => {navigate('/test-scanner')}} >
                    <img src={scanner} height="20" width="20" />
                    <p className='nav-button-title' >Scanner</p>
                </div>
                { userExists && user.tier > 0 ? (<></>) : (<>
                    <div className='nav-button second-close-group' onClick={() => {navigate('/test-tools')}} >
                        <img src={plans} height="20" width="20" />
                        <p className='nav-button-title' >Tools</p>
                    </div>
                </>)}
                */}
            </div>
            <div className='right-side-container'>
                <div className='profile-container'>
                    { userExists ? (
                        <>
                            <div className='notifications-container search' onClick={() => {
                                setScreenBlur(true);
                                setSearchScreen(true);
                                getSearch();
                                setTopBarBlur(false);
                                setProfilePopout(false);
                                setNotificationsPopout(false);
                            }}>
                                <img src={search} height="17" width="17" />
                            </div>
                            <div className={`notifications-container ${ newNotifications ? "new-notifications" : ""}`} onClick={() => {
                                setNotificationsSeen();
                                setNotificationsPopout(!notificationsPopout);

                                if(topBarBlur) setTopBarBlur(false);
                                else setTopBarBlur(true);

                                setProfilePopout(false);
                                setScreenBlur(false);
                                setSearchScreen(false);
                            }}>
                                <img src={notification_img} height="20" width="20" />
                            </div>
                            {/*
                            <div className='notifications-container mobile-hide' onClick={() => {navigate('/test-checkout')}} >
                                <img src={plans} height="20" width="20" />
                            </div>
                            */}
                            <img className='user-profile-img' src={pfp} height="24" width="24" onClick={() => {
                                setProfilePopout(!profilePopout);

                                if(topBarBlur) setTopBarBlur(false);
                                else setTopBarBlur(true);

                                setNotificationsPopout(false);
                                setScreenBlur(false);
                                setSearchScreen(false);
                            }} />
                        </>) : (<>
                            <div className='sign-up-group' >
                                <div className='sign-in-text-button final-close-group' onClick={() => {navigate("/test-signin")}}>
                                    <p>Log In</p>
                                </div>
                                <div className='sign-up-bold-button' onClick={() => {navigate("/test-signup")}}>
                                    <p>Sign Up</p>
                                </div>
                            </div>
                        </>)
                    }
                </div>    
            </div>
            <div className={`profile-popout ${userExists ? "user-signed-in" : "not-signed-in"} ${profilePopout ? "shown" : "hidden"}`} >
                { userExists ? (
                    <div className='user-container' >
                        <div className='user-info-container-popout' onClick={() => {navigate("/test-account")}}>
                            <img src={pfp} height="32" width="32" />
                            <div className='popout-user-info' >
                                <p className='username'>{user.name}</p>
                                <p className='email' >{user.email}</p>
                            </div>
                        </div>
                        <div className='nav-profile-button top' onClick={() => {navigate("/test-account")}} >
                            <img src={edit} height="18" width="18" />
                            <p>Edit Profile</p>
                        </div>
                        <div className='nav-profile-button' onClick={() => {navigate("/test-settings")}} >
                            <img src={settings} height="18" width="18" />
                            <p>Settings</p>
                        </div>
                        <div className='nav-profile-button' onClick={() => {navigate("/test-contact")}} >
                            <img src={help} height="18" width="18" />
                            <p>Help and Support</p>
                        </div>
                        <div className='logout-div' />
                        <div className='nav-profile-button logout' onClick={() => {logOutUser()}} >
                            <img src={logout} height="18" width="18" />
                            <p>Logout</p>
                        </div>
                    </div>
                ) : (
                    <div className='no-user-container' >
                        <div className='nav-signin-button signup' onClick={() => {navigate("/test-signup")}} >
                            { /* <img src={signup} height="18" width="18" */ }
                            <p>Sign Up</p>
                        </div>
                        <div className='nav-signin-button signin' onClick={() => {navigate("/test-signin")}} >
                            { /* <img src={help} height="18" width="18" /> */ }
                            <p>Log In</p>
                        </div>
                    </div>
                )}
            </div>
            <div className={`notifications-popout ${userExists ? "user-signed-in" : "not-signed-in"} ${notificationsPopout ? "shown-notifications" : "hidden"}`} >
                <div className='notifications-header' >
                    <p>Notifications</p>
                    <img src={exit} height="16" width="16" onClick={() => {
                        setNotificationsPopout(false);
                        setTopBarBlur(false);
                    }} />
                </div>
                { userExists ? (
                    <div className='notifications-list' >
                        { (notifications.length > 0) ? (
                            <div className='notifications-list-contained'>
                            {
                                notifications.map((notification) => {
                                    return(
                                        <div className='notification' key={notification.notification_uid} >
                                            <div className='notification-top' >
                                                <img src={ notification.sender_pfp ? notification.sender_pfp : standard } height="24" width="24" />
                                                <p>{notification.notification_content}</p>    
                                            </div>
                                            <div className='notification-buttons'>
                                                <div className='clear-notification-button' onClick={() => {deleteNotification(notification.notification_uid)}}>
                                                    <p>Clear</p>
                                                </div>
                                                { notification.group_invite ? (<>
                                                    <div className='join-group-button' onClick={() => {joinGroup(notification.group_uid, notification.notification_uid)}}>
                                                        <p>Join Group</p>
                                                    </div>
                                                </>) : (<></>)}
                                                { notification.post_interaction ? (<>
                                                    <div className='join-group-button' onClick={() => {openChat(notification.post_uid, navigate)}} >
                                                        <p>View Post</p>
                                                    </div>
                                                </>) : (<></>)}
                                                { notification.follow_request ? (<>
                                                    <div className='join-group-button' onClick={() => {openProfile(notification.sender_gid, navigate)}} >
                                                        <p>View Profile</p>
                                                    </div>
                                                </>) : (<></>)}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>) : (<>
                            <div className='no-notifications-container' >
                                <img src={no_notification} height="64" width="64" />
                                <p className='no-notifications-header' >No Notifications Yet!</p>
                                <p className='no-notifications-subheader' >Once updates roll in, you'll see game insights, match results, and important alerts right here.</p>
                            </div>
                        </>) }
                    </div>
                ) : (
                    <div className='no-user-container' >
                        <div className='nav-signin-button signup' onClick={() => {navigate("/test-signup")}} >
                            <p>Sign Up</p>
                        </div>
                        <div className='nav-signin-button signin' onClick={() => {navigate("/test-signin")}} >
                            <p>Log In</p>
                        </div>
                    </div>
                )}
            </div>
            <div className={`profile-overlay ${ topBarBlur ? "shown": "hidden"}`} onClick={() => {
                setTopBarBlur(false);
                setNotificationsPopout(false);
                setProfilePopout(false);
            }} />
            <div className={`screen-blur ${ screenBlur ? "blurred" : "hidden"}`} onClick={() => {
                setScreenBlur(false);
                setSearchScreen(false);
                setSignUpCTA(false);
            }} />
            <div className={`${searchScreen ? "user-search-container" : "hidden"}`} >
                <div className='search-container-top'>
                    <div className='team-search-title-container' >
                        <p>Search Anything</p>
                        <img src={exit} height="16" width="16" onClick={() => {
                            setScreenBlur(false);
                            setSearchScreen(false);
                            setSearchResult([]);
                        }} />
                    </div>
                    <div className='top-search-container' >
                        <div className='search-container-dash'>
                            <img src={search} height="18" width="18" />
                            <textarea className='user-search-input' placeholder='Search' onChange={(e) => {handleInput(e, setSearchTerm)}} onKeyDown={(e) => getSearch()} maxLength="40" />
                        </div>
                        <div className='dash-search-button' onClick={() => {getSearch()}} >
                            <p>Search</p>
                        </div>
                    </div>
                    
                </div>
                <div className='search-results-container' >
                    { userSearchResult.length > 0 && <div>
                            <p>Users:</p>
                            {
                                userSearchResult.map((search_user) => {
                                    let followingUser = false;

                                    if (userExists && user.user_following.includes(String(search_user.gid))) followingUser = true;
                                    return(
                                        <div className={`user-search-result`} onClick={() => {
                                            setScreenBlur(false);
                                            setSearchScreen(false);
                                            openProfile(search_user.gid, navigate);
                                        }} >
                                            <div className='user-search-info' >
                                                <img src={search_user.pfp ? search_user.pfp : standard} height="18" width="18" />
                                                <p>{search_user.name}</p>
                                            </div>
                                            { user.gid == search_user.gid ? (<></>) : (
                                                <div className='user-follow-button' onClick={(e) => {
                                                    e.stopPropagation();
                                                    followUser(search_user.gid);
                                                    followingUser = true;
                                                }}>
                                                    <p>{ followingUser ? "Following" : "Follow" }</p>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                    { gamesSearchResult.length > 0 && <div>
                        <p>Games:</p>
                        {
                            gamesSearchResult.map((game) => {
                                return(
                                    <div className={`user-search-result`} onClick={() => {
                                        setScreenBlur(false);
                                        setSearchScreen(false);
                                        
                                        navigate(`/game?game_id=${game.event_uid}`)
                                    }} >
                                        <div className='user-search-info' >
                                            <p>{game.event}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    }
                    { postsSearchResult.length > 0 && <div>
                        <p>Posts:</p>
                        {
                            postsSearchResult.map((post) => {
                                return(
                                    <div className='post-search-result' onClick={() => {
                                        setScreenBlur(false);
                                        setSearchScreen(false);

                                        navigate(`/test-chat?id=${post.message_id}`);
                                    }} >
                                        <div className='post-search-info' >
                                            <img src={post.user_pfp ? post.user_pfp : standard} height="20" width="20" />
                                            <p>{post.user_name}</p>
                                        </div>
                                        <p className='post-search-content'>{post.message_data}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                    }
                </div>
                <div className='search-container-bottom user-search-buttons'>
                    <div className='dash-add-button team-cancel' onClick={() => {
                        setScreenBlur(false);
                        setSearchScreen(false);
                        setSearchResult([]);
                    }} >
                        <p>Cancel</p>
                    </div>
                    <div className='dash-add-button' onClick={() => {
                        setScreenBlur(false);
                        setSearchScreen(false);
                        setSearchResult([]);
                    }}>
                        <p>Done</p>
                    </div>
                </div>
            </div>
            <div className={`${signUpCTA ? "sign-up-cta" : "not-shown"}`} >
                <div className='cta-header-container' >
                    <p>You're not signed in...</p>
                    <p>Create an account today!</p>
                </div>
                <div className='cta-buttons-container' >
                    <div className='no-user-container' >
                        <button className='nav-profile-button signup' onClick={() => {navigate("/test-signup")}} >Sign Up</button>
                        <button className='nav-profile-button signin' onClick={() => {navigate("/test-signin")}} >Log In</button>
                    </div>
                </div>
            </div>
        </div>
    )
}