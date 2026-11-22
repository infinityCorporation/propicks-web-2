/*import { createSearchParams } from "react-router-dom";

export const openCheckout = (tier: any, navigate: any, userExists: any) => {
    if(userExists){
        const newParams = createSearchParams({
            tier: tier,
            start: true,
        });
        
        navigate({
            pathname: '/test-checkout',
            search: `?${newParams.toString()}`
        });
    } else {
        const newParams = createSearchParams({
            fromTools: true,
            tier: tier,
        })

        navigate({
            pathname: '/test-signup',
            search: `?${newParams.toString()}`,
        })
    }
} */

// This may no longer be needed as a method as no checkout exists