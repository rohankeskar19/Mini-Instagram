import React from "react";
import NotificationItem from "../ListItems/NotificationItem";
const NotificationsList = ({ notifications }) => {
  return (
    <div>
      {notifications.length > 0 ? (
        notifications.map(notification => (
          <NotificationItem
            key={notification._id}
            profileUrl={notification.profileUrl}
            title={notification.title}
            postImageUrl={notification.postImageUrl}
            createdAt={notification.createdAt}
            username={notification.username}
            postId={notification.postId}
          />
        ))
      ) : (
        <h5
          style={{
            textAlign: "center",
            color: "#000"
          }}
        >
          Nothing new
        </h5>
      )}
    </div>
  );
};

export default NotificationsList;
