

import { Box, Button, Container, HStack, Input, VStack } from "@chakra-ui/react";
import Message from "./components/Message.js";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from "firebase/auth";
import { app } from "./firebase/Firbase.js";
import { useEffect, useRef, useState } from "react";

import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";


function App() {

  const db = getFirestore(app);

  const auth = getAuth(app);
  const myQuery = query(collection(db, "Messages"), orderBy("createdAt", "asc"))

  const loginHandler = () => {
    const googleProvider = new GoogleAuthProvider();
    signInWithPopup(auth, googleProvider)
  }
  const logoutHandler = () => {
    signOut(auth)
  }

  const [user, setUser] = useState(false);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const divForScroll = useRef(null);


  useEffect(() => {
    onAuthStateChanged(auth, (data) => {
      // console.log(data);
      setUser(data);
    });
    onSnapshot(myQuery, collection(db, "Messages"), (snap) => {
      setMessages(snap.docs.map((ele) => ele.data()))
    });
  }, [])



  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "Messages"), {
        text: message,
        uid: user.uid,
        url: user.photoURL,
        createdAt: serverTimestamp()
      });
      setMessage("");
      divForScroll.current.scrollIntoView({ behavior: "smooth" })
    } catch (error) {
      console.log("error", error);
    }
  }


  return (

    <Box bgGradient="linear(to-b, red.200, purple.500)">
      {
        user ? <Container h={"100vh"} >
          <VStack bg={"blackAlpha.100"} h={"100%"} padding={"4"}>
            <Button onClick={logoutHandler} w={"80%"} colorScheme="orange">Logout</Button>


            <VStack h={"full"} w={"full"}  padding={"2"} overflowY={"auto"}
              css={{
                "&::-webkit-scrollbar": {
                  display: "none"
                }
              }}>
              {
                messages?.map((element, index) => (
                  <Message key={index} text={element.text} url={element.url} user={element.uid === user.uid ? "me" : "other"} />
                ))
              }
              <div ref={divForScroll}></div>
            </VStack>

            <form onSubmit={submitHandler}>
              <HStack>
                <Input w={"100%"} variant='flushed' border={"1px"} borderColor={"white"} placeholder='Type message...'
                  value={message}
                  onChange={(e) => { setMessage(e.target.value) }}
                />
                <Button colorScheme="blue" type="submit">Send</Button>
              </HStack>
            </form>


          </VStack>
        </Container> :
          <VStack h={"100vh"} justifyContent={"center"}>
            <Button onClick={loginHandler} colorScheme="twitter" paddingX={6} paddingY={2}>Login With Google</Button>
          </VStack>
      }
    </Box>

  );
}

export default App;
