import React from "react";
import CommentItem from "../ListItems/CommentItem";

const CommentList = ({ comments, captionAsComment }) => {
  return (
    <div className="commentsContainer">
      {captionAsComment && (
        <div className="captionAsComment">
          <p className="captionUsername">{captionAsComment.username}</p>
          <p className="postCaption">{captionAsComment.content}</p>
        </div>
      )}

      {comments && comments.length > 0
        ? comments.map((comment, index) => (
            <CommentItem comment={comment} key={index} />
          ))
        : ""}
    </div>
  );
};

export default CommentList;
