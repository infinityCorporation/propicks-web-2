import './component-styles/signincta.css';

export default function SignUpScreen({ signUpCTA, navigate, inGroups }: any) {
    if (inGroups) {
        return (
            <div className={`${signUpCTA ? "sign-up-cta-groups" : "not-shown"}`}>
            <div className="cta-header-container">
                <p className="cta-title">Don't miss out!</p>
                <p className="cta-subtitle">Sign up or log in to get started.</p>
            </div>
            <div className="cta-buttons-container">
                <button className="cta-button signup-button" onClick={() => navigate("/test-signup")}>Sign Up</button>
                <button className="cta-button signin-button" onClick={() => navigate("/test-signin")}>Log In</button>
            </div>
        </div>
        )
    }

    return (
        <div className={`${signUpCTA ? "sign-up-cta" : "not-shown"}`}>
            <div className="cta-header-container">
                <p className="cta-title">Don't miss out!</p>
                <p className="cta-subtitle">Sign up or log in to get started.</p>
            </div>
            <div className="cta-buttons-container">
                <button className="cta-button signup-button" onClick={() => navigate("/test-signup")}>Sign Up</button>
                <button className="cta-button signin-button" onClick={() => navigate("/test-signin")}>Log In</button>
            </div>
        </div>
    )
}