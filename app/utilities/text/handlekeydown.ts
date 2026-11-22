export const handleKeyDown = (event: any, executeFunc: any) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      executeFunc();
    }
};