import axios from 'axios';

export const savePost = async (id, setPostsArray, user, setUser, checkUserStatus) => {
    if(!checkUserStatus) return;

    try {
        const save_response = await axios.post("https://propicks-data-api.com/v1/save-post", {
            post_id: id,
            gid: user.gid,
        })

        if (save_response.status == 204) {
            setPostsArray((posts) => posts.map((post) => { if (post.message_id === id) {
                    const isSaved = !post.is_saved;
                    return { ...post, is_saved: isSaved};
                }
                return post;
            }));

            let updated_user = { ...user, saved_posts: [...user.saved_posts] };

            if (updated_user.saved_posts.includes(id)) {
                updated_user.saved_posts.splice(updated_user.saved_posts.indexOf(id), 1);
            } else {
                updated_user.saved_posts.push(id);
            }

            setUser(updated_user)
            sessionStorage.setItem('user-session-data', JSON.stringify(updated_user));
        } 
    } catch (err) { console.log({ err: err.message })};
};