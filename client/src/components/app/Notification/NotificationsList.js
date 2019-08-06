import React from "react";
import NotificationItem from "./NotificationItem";
const NotificationsList = ({ notifications }) => {
  return (
    <div>
      {notifications.map(notification => (
        <NotificationItem
          key={notification._id}
          profileUrl={notification.profileUrl}
          title={notification.title}
          postImageUrl={notification.postImageUrl}
          createdAt={notification.createdAt}
          username={notification.username}
          postId={notification.postId}
        />
      ))}
    </div>
  );
};

export default NotificationsList;
