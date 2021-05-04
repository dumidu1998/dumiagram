import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import { storage, db } from './firebase';
import firebase from 'firebase';
import './ImageUpload.css'

function ImageUpload({ username }) {
    const [caption, setcaption] = useState('');
    const [image, setimage] = useState(null);
    const [progress, setprogress] = useState(0);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setimage(e.target.files[0])
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setprogress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                storage.ref("images").child(image.name).getDownloadURL().then(url => {
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username
                    });
                    setprogress(0);
                    setcaption("");
                    setimage(null)
                })
            }
        )
    }

    return (
        <div className="imageupload">
            <progress value={progress} max="100" className="imageupload_progress" />
            <input type="text" placeholder="Enter a Caption" onChange={event => setcaption(event.target.value)} value={caption} />
            <input type="file" onChange={handleChange} />
            <Button color="primary" variant="outlined" className="btn" onClick={handleUpload} >Upload</Button>

        </div>
    )
}

export default ImageUpload
