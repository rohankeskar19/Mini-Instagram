import React from "react";
import moment from "moment";
import { notification } from "antd";
import { Link } from "react-router-dom";

const NotificationItem = ({
  profileUrl,
  title,
  postImageUrl,
  createdAt,
  username,
  postId
}) => {
  return (
    <div key={notification._id}>
      <Link
        to={postId ? `/post/${postId}` : `/user/${username}`}
        className="notificationItem"
      >
        {profileUrl && (
          <img
            src={profileUrl}
            alt="notification profile"
            className="notificationProfile"
          />
        )}

        {title && <p className="notificationTitle">{title}</p>}
        {postImageUrl && (
          <img
            src={postImageUrl}
            alt="notification thumbnail"
            className="notificationThumbnail"
          />
        )}
        {createdAt && (
          <p className="notificationCreatedAt">{moment(createdAt).fromNow()}</p>
        )}
      </Link>
    </div>
  );
};

export default NotificationItem;
