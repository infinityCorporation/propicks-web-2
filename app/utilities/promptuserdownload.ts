export const promptUserDownload = () => {
    return (
        <>
            <div className='account-incomplete-container' >
                <p>We have a new iOS app, download it on the app store now!</p>
                <div className='incomplete-button' onClick={() => {window.open("https://apps.apple.com/us/app/propicks-social/id6755331225", "_blank")}} >
                    <p>Download!</p>
                </div>
            </div>
        </>
    )
};