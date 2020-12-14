import React from "react";
import PropTypes from "prop-types";
import { fetchMainPosts, Post, PostTypes } from "../utils/api";
import Loading from "./Loading";
import PostsList from "./PostsList";

interface PostsState {
  posts: null | Post[];
  error: null | string;
  loading: boolean;
}
type PostsAction =
  | { type: "fetch" }
  | { type: "success"; posts: Post[] }
  | { type: "error"; message: string };
function postsReducer(state: PostsState, action: PostsAction): PostsState {
  if (action.type === "fetch") {
    return {
      posts: null,
      error: null,
      loading: true,
    };
  } else if (action.type === "success") {
    return {
      posts: action.posts,
      error: null,
      loading: false,
    };
  } else if (action.type === "error") {
    return {
      posts: state.posts,
      error: action.message,
      loading: false,
    };
  } else {
    throw new Error(`That action type is not supported.`);
  }
}

export default function Posts({ type }: { type: PostTypes }) {
  const [state, dispatch] = React.useReducer(postsReducer, {
    posts: null,
    error: null,
    loading: true,
  });

  React.useEffect(() => {
    dispatch({ type: "fetch" });

    fetchMainPosts(type)
      .then((posts) => dispatch({ type: "success", posts }))
      .catch(({ message }) => dispatch({ type: "error", message }));
  }, [type]);

  if (state.loading === true || !state.posts) {
    return <Loading />;
  }

  if (state.error) {
    return <p className="center-text error">{state.error}</p>;
  }

  return <PostsList posts={state.posts} />;
}

Posts.propTypes = {
  type: PropTypes.oneOf(["top", "new"]),
};
