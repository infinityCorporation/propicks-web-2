import { useState, useEffect } from 'react';
import axios from 'axios';
import { isPollActive } from '../utilities/checkactive';
import { getRelativeTime } from '../utilities/timedistance';
import { getTimeUntilFutureFacing } from '../utilities/timeuntil';
import './component-styles/pollcomponent.css';

const PollComponent = ({ poll_id, user_id, setMainBlurred, setSignUpCTA }) => {
    // If someone who is not signed up tries to vote, send them to the signup page

    const [loading, setLoading] = useState(true);
    const [poll, setPoll] = useState({});
    const [isActive, setIsActive] = useState(true);
    const [options, setOptions] = useState([]);

    const [userVoted, setUserVoted] = useState(false);
    const [userVote, setUserVote] = useState({});

    const [error, setError] = useState(false);

    const getPollDetails = async () => {
        setLoading(true);

        try {
            const poll_response = await axios.post("https://propicks-data-api.com/v1/get-poll", {
                poll_id: poll_id,
            });

            if (poll_response.status === 200) {
                setPoll(poll_response.data.poll);
                setIsActive(isPollActive(poll_response.data.poll.ends_at));

                console.log(poll);
                setOptions(poll_response.data.options);

                hasUserVoted();
                setLoading(false);
            }
        } catch (err) {
            console.log({ err: err.message });
            setLoading(false);
            setError(true);
        }
    };

    const hasUserVoted = async () => {
        try {
            const user_response = await axios.post("https://propicks-data-api.com/v1/check-user-vote", {
                poll_id: poll_id,
                user_id: user_id,
            });

            if (user_response.status === 200) {
                setUserVoted(user_response.data.user_voted);

                if (user_response.data.user_voted) {
                    console.log(user_response.data.vote.option_id);
                    setUserVote(user_response.data.vote.option_id);
                }
            }
        } catch (err) {
            console.log({ err: err.message });
        }
    };

    const updateUserVote = async (option_id) => {
        if (user_id == "" || user_id == null) {
            setMainBlurred(true);
            setSignUpCTA(true);
            return;
        }

        try {
            const vote_response = await axios.post("https://propicks-data-api.com/v1/log-user-vote", {
                user_id: user_id,
                poll_id: poll_id,
                option_id: option_id,
                voted_at: new Date(),
            });

            if (vote_response.status === 200) {
                updateOptionCount(option_id);
                setUserVoted(true);
                setUserVote(option_id);
            }
        } catch (err) {
            console.log({ err: err.message });
        }
    };

    const updateOptionCount = (targetId) => {
        setOptions(prev =>
            prev.map(option => {
                if (option.option_id === targetId) {
                    return {
                        ...option,
                        vote_count: Number(option.vote_count) + 1,
                    };
                }
                return option;
            })
        );
        setPoll(prev => ({
            ...prev, 
            vote_count: Number(poll.vote_count) + 1,
        }));
    };

    useEffect(() => {
        getPollDetails();
    }, []);

    if (loading) {
        return (
            <div className="poll-component">
                <p className="poll-loading-text">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="poll-component">
                <p className="poll-loading-text">An error occured while loading the poll...</p>
            </div>
        );
    }

    return (
        <div className="poll-component">
            <div className="poll-header">
                <p className="poll-question">{poll.poll_question}</p>
                <p className="poll-meta">
                    {Number(poll.vote_count)} votes -{' '}
                    {isActive
                        ? `ends in ${getTimeUntilFutureFacing(poll.ends_at)}`
                        : `ended ${getRelativeTime(poll.ends_at)}`}
                </p>
            </div>
            <div className="poll-options">
                {!isActive || userVoted ? (
                    <>
                        {options.map((option, index) => {
                            const totalVotes = poll.vote_count || 1;
                            const pct = Math.round((option.vote_count / totalVotes) * 100);
                            const isVoted = userVote === option.option_id;

                            return (
                                <div key={index} className="option-row">
                                    <div
                                        className={`progress-fill ${isVoted ? 'progress-fill--voted' : 'progress-fill--default'}`}
                                        style={{ width: `${pct}%` }}
                                    />
                                    <div className="option-left">
                                        {isVoted && (
                                            <div className="check-circle">
                                                <span className="check-mark">✓</span>
                                            </div>
                                        )}
                                        <span className={`option-text ${isVoted ? 'option-text--voted' : ''}`}>
                                            {option.option_text} • {option.vote_count}
                                        </span>
                                    </div>
                                    <span className={`percentage-label ${isVoted ? 'percentage-label--voted' : ''}`}>
                                        {pct}%
                                    </span>
                                </div>
                            );
                        })}
                    </>
                ) : (
                    <>
                        {options.map((option) => (
                            <button
                                key={option.option_id}
                                className="option-container"
                                onClick={() => updateUserVote(option.option_id)}
                            >
                                <div className="option-btn-dot" />
                                <span className="option-text">{option.option_text}</span>
                            </button>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default PollComponent;