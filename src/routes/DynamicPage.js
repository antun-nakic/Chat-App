import React from "react";
import { useParams } from "react-router-dom";
import Message from "../components/Message";
import SendMessage from "../components/SendMessage";
import { useEffect, useState } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

function DynamicPage({ scroll }) {
  const { id } = useParams();
  const [image, setImage] = useState([""]);
  const [messages, setMessages] = useState([]);

  // get all messages from DB
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });
    return () => unsubscribe();
  }, []);

  // fetch user information
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
      <div className="z-10 flex mb-20 overflow-ellipsis flex-col p-3 relative">
        <h2 className="text-white text-4xl">{id}</h2>
        {messages &&
          messages.map((message) => (
            <Message key={message.id} message={message} image={image} />
          ))}
      </div>
      <span ref={scroll}> </span>
      <SendMessage scroll={scroll} />
    </div>
  );
}

export default DynamicPage;
