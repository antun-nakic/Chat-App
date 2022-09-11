import { useEffect, useState, useRef } from "react";
//firebase
import { db } from "../firebase";
import { query, collection, orderBy, onSnapshot } from "firebase/firestore";
// react-router-dom
import { useParams } from "react-router-dom";
// components
import Message from "../components/Message";
import SendMessage from "../components/SendMessage";

function DynamicPage() {
  const scroll = useRef(null);
  const { id } = useParams();
  const [image, setImage] = useState([""]);
  const [messages, setMessages] = useState([]);

  // get all messages from id param url and display them only in that url
  useEffect(() => {
    if (id) {
      const msgColl = query(
        collection(db, "rooms", id, "messages"),
        orderBy("timestamp")
      );
      onSnapshot(msgColl, (querySnapshot) => {
        setMessages(querySnapshot.docs.map((msg) => msg.data()));
      });
    } else {
      // if no room is selected, display messages in "public-room" collection
      const msgColl = query(
        collection(db, "rooms", "public-room", "messages"),
        orderBy("timestamp")
      );
      onSnapshot(msgColl, (querySnapshot) => {
        setMessages(querySnapshot.docs.map((msg) => msg.data()));
      });
    }
  }, [id]);

  // fetch user profile picture for different chats
  useEffect(() => {
    const q = query(collection(db, "userInfo"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let image = [];
      querySnapshot.forEach((doc) => {
        image.push({ ...doc.data(), id: doc.id });
      });
      setImage(image);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="h-screen bg-hero-pattern bg-cover bg-no-repeat bg-center  overflow-auto flex flex-col">
      <div className="z-10 flex mb-20 overflow-ellipsis flex-col  relative">
        <div className="w-full p-10 bg-gradient-to-r from-[#111826] to-[#1e1232] bg-opacity-70">
          <h2 className="text-[#4E7AA8] text-center md:text-left uppercase font-semibold text-4xl">
            {id ? id : "public-room"}
          </h2>
        </div>
        <div className="p-3 flex flex-col mt-1">
          {messages &&
            messages.map((message, index) => (
              <Message key={index} message={message} image={image} />
            ))}
        </div>
      </div>
      <span ref={scroll}> </span>
      <SendMessage scroll={scroll} roomId={id ? id : "public-room"} />
    </div>
  );
}

export default DynamicPage;
