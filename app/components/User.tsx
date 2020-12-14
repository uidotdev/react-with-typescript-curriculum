import React from "react";
import queryString from "query-string";
import { fetchUser, fetchPosts, User, Post } from "../utils/api";
import Loading from "./Loading";
import { formatDate } from "../utils/helpers";
import PostsList from "./PostsList";

interface PostState {
  loadingUser: boolean;
  loadingPosts: boolean;
  error: string | null;
  user: User | null;
  posts: Post[] | null;
}
type PostAction =
  | { type: "fetch" }
  | { type: "user"; user: User }
  | { type: "posts"; posts: Post[] }
  | { type: "error"; message: string };
function postReducer(state: PostState, action: PostAction): PostState {
  if (action.type === "fetch") {
    return {
      ...state,
      loadingUser: true,
      loadingPosts: true,
    };
  } else if (action.type === "user") {
    return {
      ...state,
      user: action.user,
      loadingUser: false,
    };
  } else if (action.type === "posts") {
    return {
      ...state,
      posts: action.posts,
      loadingPosts: false,
      error: null,
    };
  } else if (action.type === "error") {
    return {
      ...state,
      error: action.message,
      loadingPosts: false,
      loadingUser: false,
    };
  } else {
    throw new Error(`That action type is not supported.`);
  }
}

export default function UserComponent({
  location,
}: {
  location: { search: string };
}) {
  const { id } = queryString.parse(location.search) as { id: string };

  const [state, dispatch] = React.useReducer(postReducer, {
    user: null,
    loadingUser: true,
    posts: null,
    loadingPosts: true,
    error: null,
  });

  React.useEffect(() => {
    dispatch({ type: "fetch" });

    fetchUser(id)
      .then((user) => {
        dispatch({ type: "user", user });
        return fetchPosts(user.submitted.slice(0, 30));
      })
      .then((posts) => dispatch({ type: "posts", posts }))
      .catch(({ message }) => dispatch({ type: "error", message }));
  }, [id]);

  const { user, posts, loadingUser, loadingPosts, error } = state;

  if (error) {
    return <p className="center-text error">{error}</p>;
  }

  return (
    <React.Fragment>
      {loadingUser === true && <Loading text="Fetching User" />}{" "}
      {user && (
        <React.Fragment>
          <h1 className="header">{user.id}</h1>
          <div className="meta-info-light">
            <span>
              joined <b>{formatDate(user.created)}</b>
            </span>
            <span>
              has <b>{user.karma.toLocaleString()}</b> karma
            </span>
          </div>
          <p dangerouslySetInnerHTML={{ __html: user.about }} />
        </React.Fragment>
      )}
      {loadingPosts === true && loadingUser === false && (
        <Loading text="Fetching posts" />
      )}
      {posts && (
        <React.Fragment>
          <h2>Posts</h2>
          <PostsList posts={posts} />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
