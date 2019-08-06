import React from "react";
import { Link } from "react-router-dom";

const CommentItem = ({ comment }) => {
  return (
    <div className="commentItem">
      <img
        src={comment.profileUrl}
        alt="profile"
        className="commentProfileImage"
      />
      <div className="commentData">
        <Link className="commentUsername" to={`/user/${comment.username}`}>
          <p>{comment.username}</p>
        </Link>

        <p className="commentContent">{comment.content}</p>
      </div>
    </div>
  );
};

export default CommentItem;
