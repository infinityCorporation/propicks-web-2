import React from 'react';
import axios from 'axios';

export const flagPost = async (post_uid, post_user, post_content, flag_reason) => {
    console.log("Attempting to flag a post")
    try {
        const flag_response = await axios.post("https://propicks-data-api.com/v1/report-post", {
            post_uid: post_uid,
            post_user: post_user,
            post_content: post_content,
            flag_reason: flag_reason,
        })

        console.log(flag_response)

        if (flag_response.status == 200) {
            console.log(flag_response.data.message);
            alert("Post Reported. Thank you for keeping ProPicks safe!")
        }
    } catch (err) {
        console.log({ err: err.message });
    }
};