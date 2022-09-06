import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./../firebase";

const SendMessage = ({ scroll }) => {
  const [input, setInput] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input === "") {
      alert("Please enter a message");
      return;
    }
    const { uid, displayName } = auth.currentUser;
    await addDoc(collection(db, "messages"), {
      text: input,
      name: displayName,
      uid,
      timestamp: serverTimestamp(),
    });
    setInput("");
    scroll.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="ml-80">
      <form onSubmit={sendMessage} className="h-14 w-full  flex text-xl ">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full text-xl p-3 bg-gray-900 text-white outline-none border-none"
          type="text"
          placeholder="Message"
        />
        <button className="w-[20%] bg-green-500">Send</button>
      </form>
    </div>
  );
};

export default SendMessage;
