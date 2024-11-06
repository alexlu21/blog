import React from 'react';
import {format} from 'date-fns'
import { Link } from 'react-router-dom';
import { URL_BACKEND } from '../config';

const Post = ({_id, tittle, summary, content, cover, createdAt, author}) => {
  return (
    <div className="post" key={_id}>
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={`${URL_BACKEND}/`+cover} alt="error-imagen" />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{tittle}</h2>
        </Link>
        <p className="info">
          <a href="/" style={{cursor:'default'}} className="author">Hecho por: {author.username}</a>
          <time>Publicado el {format(new Date(createdAt), "d/MM/yyy | HH:mm")}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
};

export default Post;
