export const promptUserComplete = (navigate: any): any => {
    return (
        <>
            <div className='account-incomplete-container' >
                <p>Your profile is incomplete! Set up your account now.</p>
                <div className='incomplete-button' onClick={() => {navigate("/test-funnel")}} >
                    <p>Complete Now!</p>
                </div>
            </div>
        </>
    )
};