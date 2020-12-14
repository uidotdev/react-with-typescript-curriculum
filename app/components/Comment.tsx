import React from "react";
import { Post } from "../utils/api";
import PostMetaInfo from "./PostMetaInfo";

export default function Comment({
  comment,
}: {
  comment: Pick<Post, "by" | "time" | "id" | "text">;
}) {
  return (
    <div className="comment">
      <PostMetaInfo by={comment.by} time={comment.time} id={comment.id} />
      <p dangerouslySetInnerHTML={{ __html: comment.text }} />
    </div>
  );
}
