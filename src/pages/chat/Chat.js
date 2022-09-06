import { query, collection, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { useState, useEffect, useRef } from "react";
import Message from "../../components/Message";
import SendMessage from "../../components/SendMessage";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const scroll = useRef(null);

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

  // NEW IMAGESSS

  const [image, setImage] = useState([""]);

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
    <>
      <div className="ml-80 h-[calc(100vh-8.5rem)]  overflow-auto">
        <main className="flex flex-col p-3 relative">
          {messages &&
            messages.map((message) => (
              <Message key={message.id} message={message} image={image} />
            ))}
        </main>
        <span ref={scroll}> </span>
      </div>
      <SendMessage scroll={scroll} />
    </>
  );
};

export default Chat;
