export const updateText = (e: any, setText: any, setCharacterCount: any, setPostStarted: any) => {
    setText(e.target.value);
    setCharacterCount(e.target.value.length);

    if(e.target.value.length > 0){
        setPostStarted(true);
    } else {
        setPostStarted(false);
    }
}