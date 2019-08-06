import React from "react";
import { Icon } from "antd";
import { Link } from "react-router-dom";
const GalleryItem = ({ post }) => {
  return (
    <div className="gallery-item" tabIndex="0">
      <Link to={`/post/${post.id}`}>
        <img src={post.imageUrl} className="gallery-image" alt="post" />

        <div className="gallery-item-info">
          <ul>
            <li className="gallery-item-likes" style={{ color: "#fff" }}>
              <span className="visually-hidden">Likes:</span>
              <Icon
                type="heart"
                theme="filled"
                style={{ color: "#fff" }}
              />{" "}
              {post.likes_count}
            </li>
            <li className="gallery-item-comments" style={{ color: "#fff" }}>
              <span className="visually-hidden">Comments:</span>
              <Icon
                type="message"
                theme="filled"
                style={{ color: "#fff" }}
              />{" "}
              {post.comments_count}
            </li>
          </ul>
        </div>
      </Link>
    </div>
  );
};

export default GalleryItem;
