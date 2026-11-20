import React, { useState, useRef, useEffect, useCallback, useMemo, useReducer } from 'react';
import './style-pages/homedashboard.css';
import TopBar from './components/TopBar';
import HomeRightColumn from './components/HomeRightColumn';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import debounce from 'lodash.debounce';
import { useSearchParams } from 'react-router-dom';
import { auth } from '../firebase.js';
import AdSense from 'react-adsense';

import { MainPostDisplay } from './utilities/mainpost.js';
import { auditBetBook } from './utilities/auditbook.js';
import { auditBetKey } from './utilities/auditkey';
import { promptUserComplete } from './utilities/usercomplete.js';
import { updateText } from './utilities/updatetext.js';
import { handleInput } from './utilities/handleinput.js';
import { handleKeyDown } from './utilities/handlekeydown.js';
import { searchTeams } from './utilities/searchteams.js';
import { AnalyticsTracker } from './utilities/analyticstracker.js';

import bets from './assets/bets.png';
import team_chats from './assets/teams.png';
import up from './assets/close.png';
import search from './assets/search.png';
import exit from './assets/exit.png';
import nochats from './assets/text-bubble.png';
import SignUpScreen from '../components/SignUpScreen';
import ShareScreen from '../components/ShareScreen.js';
import BetFinder from '../components/BetFinder.js';
import HomeLeftColumn from '../components/HomeLeftColumn.js';
import TeamFinder from './components/TeamFinder.js';
import BetInfoScreen from './components/BetInfoScreen.js';
import { promptUserDownload } from './utilities/promptuserdownload.js';
import SideNav from './components/SideNav.js';

export default function Dashboard() {
    const navigate = useNavigate();
    const standard = "https://firebasestorage.googleapis.com/v0/b/propicksio.firebasestorage.app/o/defaultProfilePicture%2Fuser_pfp.jpg?alt=media&token=71272afc-3c7b-4d62-8c0d-2c2357be4207";
    const general = "00000000-0000-0000-0000-000000000000";    
    const [searchParams] = useSearchParams();
    const newCustomer = searchParams.get("nc") ? true : false;
    const attachedBetArgs = searchParams.get("bet")
    
    const [user, setUser] = useState({});
    const [userExists, setUserExists] = useState(false);
    const [pfp, setPfp] = useState(standard);

    const [posts, setPosts] = useState([]);
    const [postsExist, setPostsExist] = useState(false);
    const [postsLastDate, setPostsLastDate] = useState("");
    const [postsLastScore, setPostsLastScore] = useState(0);
    const [mainFeedEnd, setMainFeedEnd] = useState(false);
    const [dashboardLoaded, setDashboardLoaded] = useState(false);

    const [trendingPosts, setTrendingPosts] = useState([]);
    const [trendingPostsExist, setTrendingPostsExist] = useState(false);
    const [trendingPostsLastDate, setTrendingPostsLastDate] = useState("");
    const [trendingPostsLastScore, setTrendingPostsLastScore] = useState(0);
    const [trendingFeedEnd, setTrendingFeedEnd] = useState(false);

    const [followingPosts, setFollowingPosts] = useState([]);
    const [followingPostsExist, setFollowingPostsExist] = useState(false);
    const [followingPostsLastDate, setFollowingPostsLastDate] = useState("");
    const [followingFeedEnd, setFollowingFeedEnd] = useState(false);

    const [pickPosts, setPickPosts] = useState([]);
    const [pickPostsExist, setPickPostsExist] = useState(false);
    const [lastPicksDate, setLastPicksDate] = useState("");
    const [picksFeedEnd, setPicksFeedEnd] = useState(false);

    const [selectedTab, setSelectedTab] = useState("Feed");

    const [text, setText] = useState("");
    const [postStarted, setPostStarted] = useState(false);
    const [characterCount, setCharacterCount] = useState(0);
    const [collapsed, setCollapsed] = useState(false);

    const [mainBlurred, setMainBlurred] = useState(false);
    const [betFinderOpen, setBetFinderOpen] = useState(false);
    const [teamFinderOpen, setTeamFinderOpen] = useState(false);
    const [signUpCTA, setSignUpCTA] = useState(false);
    const [shareScreen, setShareScreen] = useState(false);
    const [sharedPostId, setSharedPostId] = useState("");

    const [attachedBet, setAttachedBet] = useState({});
    const [teamSearch, setTeamSearch] = useState("");
    const [teamResponse, setTeamResponse] = useState([]);
    const [teamSelected, setTeamSelected] = useState({team_id: general, team_name: "General"});
    const [forumSelected, setForumSelected] = useState({team_id: general, team_name: "General"});

    const [betInfoBool, setBetInfoBool] = useState(false);
    const [betObject, setBetObject] = useState({});
    const [betPostId, setBetPostId] = useState("");

    const [betInfoType, setBetInfoType] = useState('');
    const [attachmentBool, setAttachmentBool] = useState(false);

    const textareaRef = useRef(null);
    const countDisplayRef = useRef(null);
    const inputAreaRef = useRef(null);
    const buttonAreaRef = useRef(null);
    const upperPostButtonRef = useRef(null);

    const feedRef = useRef(null);
    const trendingRef = useRef(null);
    const followingRef = useRef(null);
    const picksRef = useRef(null);

    const tabNames = ["Feed", "Trending", "Following", "Picks"];
    const tabNamesNoUser = ["Feed", "Trending", "Picks"];

    const refreshHook = () => {
        loadDashboard();
    };

    const collapseInput = () => {
        const top = inputAreaRef.current;
        const bottom = buttonAreaRef.current;
        const upperPostButton = upperPostButtonRef.current;
        const textarea = textareaRef.current;

        if(!collapsed){
            bottom.style.display = "none";
            upperPostButton.style.display = "block";
            top.style.marginBottom = "6px";
            top.style.height = "28px"
            textarea.style.height = "28px"
            setCollapsed(true);
        } else {
            bottom.style.display = "flex";
            upperPostButton.style.display = "none";
            top.style.marginBottom = "0px";
            top.style.height = 'auto';
            textarea.style.height = 'auto';
            setCollapsed(false);
        }
    };

    const openCreatePage = () => {
        if (text.length > 0) navigate(`/test-create?message=${text}&picking=pick`);
        else navigate(`/test-create?picking=pick`)
    };

    const checkUserStatus = () => {
        if(!userExists){
            setMainBlurred(true);
            setSignUpCTA(true);
            setBetFinderOpen(false);
            setTeamFinderOpen(false);
            return false;
        }
        return true;
    };

    const createPost = async () => {
        if(!checkUserStatus()) return;

        if(characterCount > 300){
          alert("Message is too long! Try making it a bit shorter...")
          return;
        };

        if(characterCount == 0){
            alert("Post has no content. Please add something.");
            return;
        };

        if(characterCount <= 5) {
            alert("Post is not long enough. Please add content.");
            return;
        };

        const date = new Date();
        const uuid = uuidv4();

        let betting_line = (Object.keys(attachedBet).length > 0) ? attachedBet : null
  
        const post = {
            message_id: uuid,
            user_name: user.name,
            user_gid: user.gid,
            user_pfp: user.pfp,
            message_data: text,
            post_date: date,
            chat_stream_id: teamSelected.team_id,
            forum_name: teamSelected.team_name,
            betting_line: betting_line,
            is_liked: false,
            comment_count: 0,
            like_count: 0,
            is_reply: false,
            is_flagged: false,
            attachment_type: null,
            attached_parlay: null,
            attached_line: null,
            share_count: 0,
            user_verified: user.verified_user,
            attached_poll: null,
        };

        const post_for_array = {
            message_id: uuid,
            user_name: user.name,
            user_gid: user.gid,
            user_pfp: user.pfp,
            message_data: text,
            post_date: date,
            chat_stream_id: teamSelected.team_id,
            forum_name: teamSelected.team_name,
            betting_line: betting_line ? JSON.stringify(betting_line) : null,
            is_liked: false,
            comment_count: 0,
            like_count: 0,
            is_reply: false,
            attachment_type: null,
            attached_parlay: null,
            attached_line: null,
            share_count: 0,
        }

        await axios.post("https://propicks-data-api.com/v2/create-post", {
            post: post,
            user_gid: user.gid,
            message_id: uuid,
        })
            .then(() => {
                setPosts(posts => [post_for_array, ...posts])
                setText('');
                setCharacterCount(0);
                setAttachedBet({});
                setForumSelected({team_id: general, team_name: "General"})
            }).catch((err) => console.log({ err: err.message }))
    };

    const loadDashboard = async () => {
        try{
            const dashboard_response = await axios.post("https://propicks-data-api.com/v1/load-dashboard");

            let posts = dashboard_response.data.posts;
    
            if(user.liked_posts){
                posts.forEach((post) => {
                    if (user.liked_posts.includes(String(post.message_id))) {
                        post.is_liked = true;
                    }
                });
            }

            if(user.saved_posts){
                posts.forEach((post) => {
                    if(user.saved_posts.includes(String(post.message_id))) {
                        post.is_saved = true;
                    }
                })
            }
        
            setPosts(posts);    
            setPostsLastDate(posts[posts.length - 1].post_date);
            setPostsExist(true);
            setDashboardLoaded(true);
        } catch (err) { console.log({ err: err.message }) }
    };

    const loadTrending = async () => {
        try{
            const trending_response = await axios.post("https://propicks-data-api.com/v1/trending-posts");
            let posts = trending_response.data.posts;

            console.log(posts)

            if(posts.length == 0) {
                setTrendingPostsExist(false);
                return;
            }
    
            if(user.liked_posts){
                posts.map((post) => {
                    if(user.liked_posts.includes(String(post.message_id))){
                        post.is_liked = true;
                    }
                })
            }

            if(user.saved_posts){
                posts.forEach((post) => {
                    if(user.saved_posts.includes(String(post.message_id))) {
                        post.is_saved = true;
                    }
                })
            }

            posts.forEach((post) => {
                if(post.post_date)
                console.log(post.post_date)
            })
        
            setTrendingPosts(posts);    
            setTrendingPostsLastDate(posts[posts.length - 1].post_date);
            setPostsLastScore(posts[posts.length - 1].like_count + posts[posts.length - 1].comment_count + posts[posts.length - 1].share_count);
            setTrendingPostsExist(true);
        } catch (err) { console.log({ err: err.message }) }
    };

    const loadFollowing = async () => {
        if(user.user_following.length == 0) return;

        try {
            const following_response = await axios.post("https://propicks-data-api.com/v1/following-posts", {
                following_list: user.user_following
            })
            let posts = following_response.data.posts;

            console.log(posts);
    
            if(user.liked_posts){
                posts.forEach((post) => {
                    if (user.liked_posts.includes(String(post.message_id))) {
                        post.is_liked = true;
                    }
                });
            }

            if(user.saved_posts){
                posts.forEach((post) => {
                    if(user.saved_posts.includes(String(post.message_id))) {
                        post.is_saved = true;
                    }
                })
            }

            setFollowingPosts(posts);    
            setFollowingPostsLastDate(posts[posts.length - 1].post_date);
            setFollowingPostsExist(true);
        } catch (err) { console.log ({ err: err.message })}
    };

    const loadPicks = async () => {
        try{
            const picks_response = await axios.post("https://propicks-data-api.com/v1/picks-posts");
            console.log(picks_response.data)

            if(picks_response.status == 200){
                let posts = picks_response.data.posts;
        
                if(user.liked_posts){
                    posts.map((post) => {
                        if(user.liked_posts.includes(String(post.message_id))){
                            post.is_liked = true;
                        }
                    })
                }

                if(user.saved_posts){
                    posts.forEach((post) => {
                        if(user.saved_posts.includes(String(post.message_id))) {
                            post.is_saved = true;
                        }
                    })
                }
            
                setPickPosts(posts);    
                setLastPicksDate(posts[posts.length - 1].post_date);
                setPickPostsExist(true);
            } else setPickPostsExist(false);
        } catch (err) { console.log({ err: err.message }) }
    };

    const loadAdditionalPosts = async () => {
        try {
            const scroll_posts_response = await axios.post("https://propicks-data-api.com/v1/load-dashboard-scroll", {
                cutoff_date: postsLastDate,
            })

            if(scroll_posts_response.status == 200) {
                let additional_posts = scroll_posts_response.data.posts;

                if(user.liked_posts){
                    additional_posts.forEach((post) => {
                        if (user.liked_posts.includes(String(post.message_id))) {
                            post.is_liked = true;
                        }
                    });
                }
    
                if(user.saved_posts){
                    additional_posts.forEach((post) => {
                        if(user.saved_posts.includes(String(post.message_id))) {
                            post.is_saved = true;
                        }
                    })
                }

                setPosts(posts => [...posts, ...additional_posts])
                setPostsLastDate(additional_posts[additional_posts.length - 1].post_date)
                //setCallLoading(false);
            } else if (scroll_posts_response.status == 204) {
                setMainFeedEnd(true);
            }
        } catch (err) {
            console.log({ err: err.message })
        }
    };

    const loadAdditionalTrendingPosts = async () => {
        try {
            const scroll_posts_response = await axios.post("https://propicks-data-api.com/v1/trending-posts-scroll", {
                last_post_date: trendingPostsLastDate,
                last_score: trendingPostsLastScore,
            })

            if(scroll_posts_response.status == 200) {
                let additional_posts = scroll_posts_response.data.posts;

                if(user.liked_posts){
                    additional_posts.forEach((post) => {
                        if (user.liked_posts.includes(String(post.message_id))) {
                            post.is_liked = true;
                        }
                    });
                }
    
                if(user.saved_posts){
                    additional_posts.forEach((post) => {
                        if(user.saved_posts.includes(String(post.message_id))) {
                            post.is_saved = true;
                        }
                    })
                }

                setTrendingPosts(posts => [...posts, ...additional_posts])
                setTrendingPostsLastDate(additional_posts[additional_posts.length - 1].post_date)
                setPostsLastScore(additional_posts[additional_posts.length - 1].like_count + additional_posts[additional_posts.length - 1].comment_count + additional_posts[additional_posts.length - 1].share_count);

                //setCallLoading(false);
            } else if (scroll_posts_response.status == 204) {
                setTrendingFeedEnd(true);
            }
        } catch (err) {
            console.log({ err: err.message })
        }
    };

    const loadAdditionalFollowingPosts = async () => {
        try {
            const scroll_posts_response = await axios.post("https://propicks-data-api.com/v1/following-posts-scroll", {
                cutoff_date: followingPostsLastDate,
                following_list: user.user_following,
            })

            if(scroll_posts_response.status == 200) {
                let additional_posts = scroll_posts_response.data.posts;

                if(user.liked_posts){
                    additional_posts.forEach((post) => {
                        if (user.liked_posts.includes(String(post.message_id))) {
                            post.is_liked = true;
                        }
                    });
                }
    
                if(user.saved_posts){
                    additional_posts.forEach((post) => {
                        if(user.saved_posts.includes(String(post.message_id))) {
                            post.is_saved = true;
                        }
                    })
                }

                setFollowingPosts(posts => [...posts, ...additional_posts])
                setFollowingPostsLastDate(additional_posts[additional_posts.length - 1].post_date)
                //setCallLoading(false);
            } else if (scroll_posts_response.status == 204) {
                setFollowingFeedEnd(true);
            }
        } catch (err) {
            console.log({ err: err.message })
        }
    };

    const loadAdditionalPicksPosts = async () => {
        try {
            const scroll_posts_response = await axios.post("https://propicks-data-api.com/v1/picks-posts-scroll", {
                cutoff_date: lastPicksDate,
            })

            if(scroll_posts_response.status == 200) {
                let additional_posts = scroll_posts_response.data.posts;

                if(user.liked_posts){
                    additional_posts.forEach((post) => {
                        if (user.liked_posts.includes(String(post.message_id))) {
                            post.is_liked = true;
                        }
                    });
                }
    
                if(user.saved_posts){
                    additional_posts.forEach((post) => {
                        if(user.saved_posts.includes(String(post.message_id))) {
                            post.is_saved = true;
                        }
                    })
                }

                setPickPosts(posts => [...posts, ...additional_posts])
                setLastPicksDate(additional_posts[additional_posts.length - 1].post_date)
                //setCallLoading(false);
            } else if (scroll_posts_response.status == 204) {
                setPicksFeedEnd(true);
            }
        } catch (err) {
            console.log({ err: err.message })
        }
    };

    const handleScroll = useCallback(
        debounce(() => {
            const mainFeed = feedRef.current;
        
            if (mainFeed.scrollTop + mainFeed.clientHeight >= mainFeed.scrollHeight - 450) {
                loadAdditionalPosts();
            }
        }, 150), [loadAdditionalPosts]
    );

    const handleTrendingScroll = useCallback(
        debounce(() => {
            const mainFeed = trendingRef.current;
        
            if (mainFeed.scrollTop + mainFeed.clientHeight >= mainFeed.scrollHeight - 450) {
                loadAdditionalTrendingPosts();
            }
        }, 150), [loadAdditionalPosts]
    );

    const handleFollowingScroll = useCallback(
        debounce(() => {
            const mainFeed = followingRef.current;
        
            if (mainFeed.scrollTop + mainFeed.clientHeight >= mainFeed.scrollHeight - 450) {
                loadAdditionalFollowingPosts();
            }
        }, 150), [loadAdditionalPosts]
    );

    const handlePicksScroll = useCallback(
        debounce(() => {
            const mainFeed = picksRef.current;
        
            if (mainFeed.scrollTop + mainFeed.clientHeight >= mainFeed.scrollHeight - 450) {
                loadAdditionalPicksPosts();
            }
        }, 150), [loadAdditionalPosts]
    );

    const getLine = useCallback(async (bet_id) => {
        const bet_response = await axios.post("https://propicks-data-api.com/v1/get-line-object", {
            bet_uid: bet_id,
        });

        if(bet_response.status === 200) setAttachedBet(bet_response.data.line[0]);
        else return {};
    });

    const fetchUserProfile = async (gid) => {
        const session = sessionStorage.getItem("user-session-data");
        let user_session_data = null;

        try { user_session_data = session ? JSON.parse(session) : null } 
        catch (err) { sessionStorage.removeItem("user-session-data") }

        if(user_session_data != null && !newCustomer){
            setUser(user_session_data);
            setPfp(user_session_data.pfp);
            setUserExists(true);  
        } else {
            const profile_response = await axios.post("https://propicks-data-api.com/v1/get-user", {
                gid: gid,
            });

            if(profile_response.status === 200){
                setUser(profile_response.data.user);
                setUserExists(true);
                setPfp(profile_response.data.user.pfp);

                sessionStorage.setItem('user-session-data', JSON.stringify(profile_response.data.user));
            } else console.log({ err: "Call not succesful "});
        }
    };

    // useEffect to adjust create-post-container size
    useEffect(() => {
        const textarea = textareaRef.current;
        const countDisplay = countDisplayRef.current;
        
        if (textarea) {
            textarea.style.height = "auto"; // Reset height to recalculate
            textarea.style.height = `${textarea.scrollHeight}px`; // Set new height
        }

        if (countDisplay){
            if(characterCount > 300) countDisplay.style.color = "#FF9147";
            else countDisplay.style.color = "#B3B3B3";
        }
    }, [text, characterCount]);

    // useEffect for handling likes could go here
    useEffect(() => {
        if(user){
            loadDashboard();
        }
    }, [user]);

    // useEffect for loading scroll posts for all 4 main feeds
    useEffect(() => {
        const feed = feedRef.current;
        if (!feed) return;

        feed.addEventListener('scroll', handleScroll);
        return () => feed.removeEventListener('scroll', handleScroll);
    }, [posts]);

    // useEffect for loading scroll posts for trending feed
    useEffect(() => {
        const trending = trendingRef.current;
        if (!trending) return;

        trending.addEventListener('scroll', handleTrendingScroll);
        return () => trending.removeEventListener('scroll', handleTrendingScroll);
    }, [trendingPosts]);

    // useEffect for loading scroll posts for following feed
    useEffect(() => {
        const following = followingRef.current;
        if (!following) return;

        following.addEventListener('scroll', handleFollowingScroll);
        return () => following.removeEventListener('scroll', handleFollowingScroll);
    }, [followingPosts]);

    // useEffect for loading scroll posts for picks feed
    useEffect(() => {
        const picks = picksRef.current;
        if (!picks) return;

        picks.addEventListener('scroll', handlePicksScroll);
        return () => picks.removeEventListener('scroll', handlePicksScroll);
    }, [pickPosts]);

    // useEffect to fetch the user's profile
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) fetchUserProfile(user.uid);
            else {
                setPfp(standard);
                setUser({});
                setUserExists(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // useEffect to deal with attached bets to posts
    useEffect(() => {
        if(attachedBetArgs) getLine(attachedBetArgs)
    }, [attachedBetArgs]);

    return(
        <div className='home-dashboard'>
            <TopBar />
            <div className='dashboard-main-content'>
                {/* <HomeLeftColumn /> */}
                <SideNav navigate={navigate} />
                <div className='social-feed-container'>
                    {/* promptUserDownload() */ }
                    { (user.funnel == false && userExists == true) ? promptUserComplete(navigate) : <></>}
                    <div className="forum-menu-container">
                        { userExists ? (
                            tabNames.map((tab) => (
                                <div
                                    key={tab}
                                    onClick={() => {
                                        setSelectedTab(tab)

                                        if(tab == "Feed") loadDashboard();
                                        if(tab == "Trending") loadTrending();
                                        if(tab == "Following") loadFollowing();
                                        if(tab == "Picks") loadPicks();
                                    }}
                                    className={`forum-menu-button ${selectedTab === tab ? "current" : ""}`}
                                >
                                    {tab}
                                </div>
                            ))) : (
                                tabNamesNoUser.map((tab) => (
                                    <div
                                        key={tab}
                                        onClick={() => {
                                            setSelectedTab(tab)
    
                                            if(tab == "Feed") loadDashboard();
                                            if(tab == "Trending") loadTrending();
                                            if(tab == "Picks") loadPicks();
                                        }}
                                        className={`forum-menu-button ${selectedTab === tab ? "current" : ""}`}
                                    >
                                        {tab}
                                    </div>
                                )))}
                    </div>
                    <div className="feed-content">
                        {selectedTab === "Feed" && 
                            <div className='main-feed-content' ref={feedRef} >
                                <div className={`create-post-container ${ userExists ? "create-post-logged-in" : ""}`}>
                                    <div className='create-post-main' ref={inputAreaRef} onClick={() => {if(collapsed){
                                            collapseInput()
                                        }
                                    }}>
                                        <img className='create-post-pfp' src={pfp} height="28" width="28" />
                                        <textarea className='create-post-input no-detail' ref={textareaRef} value={text} type="text" onKeyDown={(e) => {handleKeyDown(e, createPost)}} onChange={(e) => updateText(e, setText, setCharacterCount, setPostStarted)} placeholder='Write a post!'/>
                                        <div className='create-post-right-button'>
                                            <button className={`upper-post-button ${postStarted ? "" : "not-started"}`} ref={upperPostButtonRef} onClick={() => createPost()}>Post</button>
                                        </div>
                                    </div>
                                    <div className='create-post-buttons' ref={buttonAreaRef}>
                                        <div className='create-post-buttons-left-container'>
                                            <button className='create-post-left-button' onClick={() => {
                                                // setBetFinderOpen(true);
                                                // setMainBlurred(!mainBlurred); 

                                                // currently just sending to the create post page
                                                openCreatePage();
                                            }}>
                                                <img src={bets} height="16" width="16" />
                                                <p className='create-post-left-button-text' >Bets</p>
                                            </button>
                                            <button className='create-post-left-button' onClick={() => {
                                                /*
                                                setTeamFinderOpen(true);
                                                setBetFinderOpen(false);
                                                setSignUpCTA(false);
                                                setMainBlurred(!mainBlurred);
                                                searchTeams(teamSearch, setTeamResponse); 
                                                */

                                                // currently just sending to the create post page
                                                openCreatePage();
                                            }}>
                                                <img src={team_chats} height="16" width="16" />
                                                <p className='create-post-left-button-text' >Teams</p>
                                            </button>
                                            <button className='create-post-left-button mobile-hide' onClick={() => collapseInput()}>
                                                <img src={up} height="16" width="16" />
                                                <p className='create-post-left-button-text' >Hide</p>
                                            </button>
                                        </div>
                                        <div className='create-post-buttons-right-container'>
                                            <div className='create-post-right-button' disabled={true}>
                                                <p className='character-count' ref={countDisplayRef} >
                                                    {characterCount}/300    
                                                </p>
                                            </div>
                                            <p className='mobile-hide' >{forumSelected.team_name}</p>
                                            <div className='create-post-right-button' >
                                                <button className={`post-button ${postStarted ? "" : "not-started"}`} onClick={() => createPost()}>Post</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                { (attachedBet.uid != undefined && attachedBet.uid != null) ? (<>
                                    <div className='attached-bet-container' onClick={() => {
                                        setBetFinderOpen(true);
                                        setMainBlurred(true);
                                    }}>
                                        <p>{attachedBet.event}</p>
                                        <div className='attached-bet-right' >
                                            <p>{auditBetBook(attachedBet.book)} - {auditBetKey(attachedBet.key)}</p>
                                            <div className='attached-bet-exit' onClick={(e) => {
                                                e.stopPropagation();
                                                setAttachedBet({});
                                            }}>
                                                <img src={exit} height="16" width="16" />
                                            </div>
                                        </div>
                                        
                                    </div>
                                </>) : (<></>)}
                                <div className='social-feed'>
                                    {   (postsExist ? (
                                       <>
                                            {posts.map((post, index) => (
                                                <React.Fragment key={post.message_id}>
                                                    <MainPostDisplay
                                                        post={post}
                                                        navigate={navigate}
                                                        setPosts={setPosts}
                                                        user={user}
                                                        setUser={setUser}
                                                        checkUserStatus={checkUserStatus}
                                                        setShareScreen={setShareScreen}
                                                        setMainBlurred={setMainBlurred}
                                                        mainBlurred={mainBlurred}
                                                        setSharedPostId={setSharedPostId}
                                                        setBetInfoBool={setBetInfoBool}
                                                        setBetObject={setBetObject}
                                                        setBetPostId={setBetPostId}
                                                        setBetInfoType={setBetInfoType}
                                                        refresh_hook={refreshHook}
                                                        setSignUpCTA={setSignUpCTA}
                                                        setAttachmentBool={setAttachmentBool}
                                                    />
                                                    {(index + 1) % 10 === 5 && (
                                                        <div className='dash-ad-frame-container' >
                                                            <div className="dash-ad-frame">
                                                                <AdSense.Google
                                                                    client="ca-pub-8494015050743005"
                                                                    slot="6856315638"
                                                                    style={{ display: 'block', width: '100%', height: '96px' }}
                                                                    format=''
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            <div className='no-posts-container' >
                                                <img src={nochats} height="96" width="96" />
                                                <p className='no-posts-title' >Something isn't working right...</p>
                                                <p className='no-posts-subtitle' >Try again later or contact us for more information!</p>
                                            </div>
                                        </>))
                                    }
                                </div>
                                <div className={`end-feed-message ${mainFeedEnd ? 'show-message' : ""}`} >
                                    <p>Nothing more to see here... for now!</p>
                                </div>
                            </div>
                        }
                        {selectedTab === "Trending" && 
                            <div className='trending-feed-content' ref={trendingRef} >
                                <div className='social-feed'>
                                    { (trendingPostsExist ? (
                                            <>
                                                {trendingPosts.map((post, index) => { return (
                                                    <React.Fragment key={post.message_id}>
                                                        <MainPostDisplay 
                                                            post={post} 
                                                            navigate={navigate} 
                                                            setPosts={setTrendingPosts} 
                                                            user={user} 
                                                            setUser={setUser} 
                                                            checkUserStatus={checkUserStatus} 
                                                            setShareScreen={setShareScreen} 
                                                            setMainBlurred={setMainBlurred} 
                                                            mainBlurred={mainBlurred} 
                                                            setSharedPostId={setSharedPostId} 
                                                            setBetInfoBool={setBetInfoBool} 
                                                            setBetObject={setBetObject} 
                                                            setBetPostId={setBetPostId} 
                                                            setBetInfoType={setBetInfoType} 
                                                            refresh_hook={refreshHook}
                                                            setSignUpCTA={setSignUpCTA}
                                                            setAttachmentBool={setAttachmentBool}
                                                        />
                                                        {(index + 1) % 10 === 5 && (
                                                            <div className='dash-ad-frame-container' >
                                                                <div className="dash-ad-frame">
                                                                    <AdSense.Google
                                                                        client="ca-pub-8494015050743005"
                                                                        slot="6856315638"
                                                                        style={{ display: 'block', width: '100%', height: '96px' }}
                                                                        format=''
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </React.Fragment>
                                                )})}
                                            </>
                                        ) : (
                                            <div className='no-posts-container' >
                                                <img src={nochats} height="96" width="96" />
                                                <p className='no-posts-title' >There nothing trending right now!</p>
                                                <p className='no-posts-subtitle' >Try checking back later to see if there's anything new.</p>
                                            </div>
                                    )) }
                                </div>
                                <div className={`end-feed-message ${trendingFeedEnd ? 'show-message' : ""}`} >
                                    <p>Nothing more to see here... for now!</p>
                                </div>
                            </div>
                        }
                        {selectedTab === "Following" && 
                            <div className='trending-feed-content' ref={followingRef} >
                                <div className='social-feed'>
                                    { (followingPostsExist ? (
                                            <>
                                                {followingPosts.map((post, index) => { return (
                                                    <React.Fragment key={post.message_id}>
                                                        <MainPostDisplay 
                                                            post={post} 
                                                            navigate={navigate} 
                                                            setPosts={setFollowingPosts} 
                                                            user={user} setUser={setUser} 
                                                            checkUserStatus={checkUserStatus} 
                                                            setShareScreen={setShareScreen} 
                                                            setMainBlurred={setMainBlurred} 
                                                            mainBlurred={mainBlurred} 
                                                            setSharedPostId={setSharedPostId} 
                                                            setBetInfoBool={setBetInfoBool} 
                                                            setBetObject={setBetObject} 
                                                            setBetPostId={setBetPostId} 
                                                            setBetInfoType={setBetInfoType} 
                                                            refresh_hook={refreshHook}
                                                            setSignUpCTA={setSignUpCTA}
                                                            setAttachmentBool={setAttachmentBool}
                                                        /> 
                                                        {(index + 1) % 10 === 5 && (
                                                            <div className='dash-ad-frame-container' >
                                                                <div className="dash-ad-frame">
                                                                    <AdSense.Google
                                                                        client="ca-pub-8494015050743005"
                                                                        slot="6856315638"
                                                                        style={{ display: 'block', width: '100%', height: '96px' }}
                                                                        format=''
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </React.Fragment>
                                                )})}
                                            </>
                                        ) : (
                                            <div className='no-posts-container' >
                                                <img src={nochats} height="96" width="96" />
                                                <p className='no-posts-title' >Your friends haven't posted yet!</p>
                                                <p className='no-posts-subtitle' >Try following some more people to see more posts.</p>
                                            </div>
                                    )) }
                                </div>
                                <div className={`end-feed-message ${followingFeedEnd ? 'show-message' : ""}`} >
                                    <p>Nothing more to see here... for now!</p>
                                </div>
                            </div>
                        }
                        {selectedTab === "Picks" && 
                            <div className='trending-feed-content' ref={picksRef} >
                                <div className='social-feed'>
                                    { (pickPostsExist ? (
                                            <>
                                                {pickPosts.map((post, index) => { return (
                                                    <React.Fragment key={post.message_id}>
                                                        <MainPostDisplay 
                                                            post={post} 
                                                            navigate={navigate} 
                                                            setPosts={setPickPosts} 
                                                            user={user} 
                                                            setUser={setUser} 
                                                            checkUserStatus={checkUserStatus} 
                                                            setShareScreen={setShareScreen} 
                                                            setMainBlurred={setMainBlurred} 
                                                            mainBlurred={mainBlurred} 
                                                            setSharedPostId={setSharedPostId} 
                                                            setBetInfoBool={setBetInfoBool} 
                                                            setBetObject={setBetObject} 
                                                            setBetPostId={setBetPostId} 
                                                            setBetInfoType={setBetInfoType} 
                                                            refresh_hook={refreshHook}
                                                            setSignUpCTA={setSignUpCTA}
                                                            setAttachmentBool={setAttachmentBool}
                                                        /> 
                                                        {(index + 1) % 10 === 5 && (
                                                            <div className='dash-ad-frame-container' >
                                                                <div className="dash-ad-frame">
                                                                    <AdSense.Google
                                                                        client="ca-pub-8494015050743005"
                                                                        slot="6856315638"
                                                                        style={{ display: 'block', width: '100%', height: '96px' }}
                                                                        format=''
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </React.Fragment>
                                                )})}
                                            </>
                                        ) : (
                                            <div className='no-posts-container' >
                                                <img src={nochats} height="96" width="96" />
                                                <p className='no-posts-title' >No one has made any picks!</p>
                                                <p className='no-posts-subtitle' >Try checking back later to see if there's anything new.</p>
                                            </div>
                                    )) }
                                </div>
                                <div className={`end-feed-message ${picksFeedEnd ? 'show-message' : ""}`} >
                                    <p>Nothing more to see here... for now!</p>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <HomeRightColumn />
            </div>
            <div className={`${mainBlurred ? "main-overlay" : "not-shown"}`} onClick={() => {
                setMainBlurred(!mainBlurred);
                setBetFinderOpen(false);
                setTeamFinderOpen(false);
                setSignUpCTA(false);
                setShareScreen(false);
                setBetInfoBool(false);
                setBetObject({});
                setSharedPostId("");
                setBetInfoType('');
                setAttachmentBool(false);
            }}></div>
            <BetFinder 
                betFinderOpen={betFinderOpen} 
                setBetFinderOpen={setBetFinderOpen} 
                setMainBlurred={setMainBlurred} 
                setAttachedBet={setAttachedBet}
                navigate={navigate}
            ></BetFinder>
            <TeamFinder 
                teamFinderOpen={teamFinderOpen} 
                setTeamFinderOpen={setTeamFinderOpen}
                setBetFinderOpen={setBetFinderOpen}
                setForumSelected={setForumSelected}
                teamSelected={teamSelected}
                setSignUpCTA={setSignUpCTA}
                setTeamSelected={setTeamSelected}
                mainBlurred={mainBlurred}
                setMainBlurred={setMainBlurred}
            ></TeamFinder>
            <SignUpScreen signUpCTA={signUpCTA} navigate={navigate} />
            <ShareScreen shareScreen={shareScreen} sharedPostId={sharedPostId} />
            <BetInfoScreen 
                betInfoBool={betInfoBool} 
                navigate={navigate} 
                betObject={betObject} 
                setBetInfoBool={setBetInfoBool} 
                setAttachedBet={setAttachedBet} 
                setBetObject={setBetObject} 
                setMainBlurred={setMainBlurred} 
                betPostId={betPostId} 
                attached_type={betInfoType} 
                attachmentBool={attachmentBool}
            />
            { dashboardLoaded ? <AnalyticsTracker /> : <></> }
        </div>
    )
}