import axios from 'axios';

export const deletePost = async (post_uid, user_gid, refresh_hook) => {
    try {
        const delete_response = await axios.post("https://propicks-data-api.com/v1/delete-post", {
            post_uid: post_uid,
            user_gid: user_gid
        });

        if (delete_response.status == 200) {
            alert("Post was deleted.")
            refresh_hook();
        }
    } catch (err) {
        console.log({ err: err.message })
    }
};