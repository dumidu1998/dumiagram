import './App.css';
import Post from './Post';
import { auth, db } from './firebase'
import { useEffect, useState } from 'react';
import { Button, Input, makeStyles, Modal } from '@material-ui/core';
import ImageUpload from './ImageUpload';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setposts] = useState([]);
  const [open, setopen] = useState(false);
  const [openSignIn, setopenSignIn] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null)
      }
    })
    return () => {
      unsubscribe();
    }
  }, [user, username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setposts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, [])

  const signup = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser => {
        return authUser.user.updateProfile({
          displayName: username
        })
      }))
      .catch((error) => alert(error.message));
    setopen(false);
  }

  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))
    setopenSignIn(false);
  }


  return (
    <div className="App">

      <Modal
        open={open}
        onClose={() => setopen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img className="app_headerImagea" src="https://firebasestorage.googleapis.com/v0/b/dumiagram.appspot.com/o/images%2Flogo.png?alt=media&token=a7cd5f38-b91c-4313-b5bb-26ed70410817"
                alt="aa" width="80px" />
            </center>
            <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" onClick={signup}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setopenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img className="app_headerImagea" src="https://firebasestorage.googleapis.com/v0/b/dumiagram.appspot.com/o/images%2Flogo.png?alt=media&token=a7cd5f38-b91c-4313-b5bb-26ed70410817"
                alt="aa" width="80px" />
            </center>
            <Input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>
      <div className='app_header'>
        <img className="app_headerImage" src="https://firebasestorage.googleapis.com/v0/b/dumiagram.appspot.com/o/images%2Flogo.png?alt=media&token=a7cd5f38-b91c-4313-b5bb-26ed70410817"
          alt="aa" width="60px" />
        {user ? (
          <Button onClick={() => auth.signOut()} >Logout</Button>
        ) : (
          <div className="app_loginContainer">
            < Button onClick={() => setopenSignIn(true)}>Sign In</Button>
            < Button onClick={() => setopen(true)}>Sign Up</Button>

          </div>
        )}
      </div>
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />

      ) : (
        <h3>Please Login to Upload</h3>
      )}
      <div className="app_post">
        {
          posts.map(({ id, post }) => (
            <Post key={id} postId={id} user={user} username={post.username} imageURL={post.imageUrl} caption={post.caption} />
          ))
        }
      </div>

    </div >
  );
}

export default App;
