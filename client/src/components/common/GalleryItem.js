import React from "react";
import { Icon } from "antd";
const GalleryItem = ({ post }) => {
  return (
    <div className="gallery-item" tabIndex="0">
      <img src={post.imageUrl} className="gallery-image" alt="post" />

      <div className="gallery-item-info">
        <ul>
          <li className="gallery-item-likes">
            <span className="visually-hidden">Likes:</span>
            <Icon type="heart" theme="filled" /> {post.likes_count}
          </li>
          <li className="gallery-item-comments">
            <span className="visually-hidden">Comments:</span>
            <Icon type="message" theme="filled" /> {post.comments_count}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default GalleryItem;
