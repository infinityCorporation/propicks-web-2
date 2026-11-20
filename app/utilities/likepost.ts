import axios from 'axios';

export const likePost = async (id, post_owner, setPostArray, user, setUser, checkUserStatus) => {
    if (!checkUserStatus()) return;

    try {
      const response = await axios.post("https://propicks-data-api.com/like-post", {
        post_id: id,
        user_id: user.gid,
        user_name: user.name,
        user_pfp: user.pfp,
        post_owner: post_owner,
      });

      if(response.status == 200){
        setPostArray((posts) => posts.map((post) => { if (post.message_id === id) {
                const isLiked = !post.is_liked;
                return { ...post, is_liked: isLiked, like_count: post.like_count + (isLiked ? 1 : -1) };
            }
            return post;
        }));

        let updated_user = { ...user, liked_posts: [...user.liked_posts] };

        if (updated_user.liked_posts.includes(id)) updated_user.liked_posts.splice(updated_user.liked_posts.indexOf(id), 1);
        else updated_user.liked_posts.push(id);

        setUser(updated_user);
        sessionStorage.setItem('user-session-data', JSON.stringify(updated_user));
      } else console.log("There was an error...");
    } catch (err) { console.log({ err: err.message }) }
};