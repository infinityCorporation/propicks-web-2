export const updateText = (e, setText, setCharacterCount, setPostStarted) => {
    setText(e.target.value);
    setCharacterCount(e.target.value.length);

    if(e.target.value.length > 0){
        setPostStarted(true);
    } else {
        setPostStarted(false);
    }
}