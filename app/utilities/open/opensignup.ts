export const openSignUp = (navigate: any) => {
    navigate({
        pathname: '/test-signup',
        search: `?fromLanding=true`
    });
};