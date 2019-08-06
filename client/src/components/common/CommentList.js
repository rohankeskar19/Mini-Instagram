import React from "react";
import CommentItem from "./CommentItem";

const CommentList = ({ comments, captionAsComment }) => {
  return (
    <div className="commentsContainer">
      <div className="captionAsComment">
        <p className="captionUsername">{captionAsComment.username}</p>
        <p className="postCaption">{captionAsComment.content}</p>
      </div>

      {comments.map((comment, index) => (
        <CommentItem comment={comment} key={index} />
      ))}
    </div>
  );
};

export default CommentList;
