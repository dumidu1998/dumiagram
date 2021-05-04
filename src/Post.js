import React, { useEffect, useState } from 'react';
import './post.css';
import Avatar from '@material-ui/core/Avatar'
import { db } from './firebase';
import firebase from 'firebase';


function Post(props) {
    const [comments, setcomments] = useState([]);
    const [comment, setcomment] = useState('')

    useEffect(() => {
        let unsubscribe;
        if (props.postId) {
            unsubscribe = db.collection("posts").doc(props.postId).collection("comments").orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
                setcomments(snapshot.docs.map((doc) => doc.data()));
            })
        }
        return () => {
            unsubscribe();
        }
    }, [props.postId])

    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(props.postId).collection("comments").add({
            username: props.user.displayName,
            text: comment,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setcomment('');
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt={props.username}
                    src='/static/images/avatar/1.jpg'
                />
                <h4>{props.username}</h4>
            </div>
            <img className="post__image" src={props.imageURL} alt="" />
            <h4 className="post__text"><strong>{props.username} </strong>{props.caption}</h4>

            <div className="post_comments">
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>
            { props.user && (
                <form className="post_commentbox" >
                    <input type="text" placeholder="Add a Comment" value={comment} onChange={(e) => setcomment(e.target.value)} className="post_input" />
                    <button className="post_button" disabled={!comment} type="submit" onClick={postComment} >Post</button>
                </form>

            )

            }
        </div>
    )
}

export default Post
