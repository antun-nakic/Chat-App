import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./../firebase";
import { MdSend } from "react-icons/md";
import { toast } from "react-toastify";

const SendMessage = ({ scroll, roomId }) => {
  const [input, setInput] = useState("");

  // send message to the chat
  const sendMessage = async (e) => {
    e.preventDefault();
    if (input === "") {
      toast.warn("Please enter a message");
      return;
    }

    // add message to the firestore database, rooms and messages collection
    const { uid, displayName } = auth.currentUser;
    await addDoc(collection(db, "rooms", roomId, "messages"), {
      name: displayName,
      message: input,
      timestamp: serverTimestamp(),
      uid: uid,
    });
    setInput("");
    scroll.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`mt-auto pt-6 z-20 bg-hero-pattern bg-cover bg-bottom fixed bottom-0  md:w-[65%] 2xl:w-[65.7%] pb-7 px-5 md:px-20`}>
      <form onSubmit={sendMessage} className=" w-full flex text-xl ">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full text-base p-3 bg-transparent text-white border rounded-2xl border-white border-opacity-30 h-14 placeholder-white placeholder-opacity-40 font-light focus:outline-none"
          type="text"
          placeholder="Write a message..."
        />
        <button className="w-[10%] md:ml-0 ml-2">
          <MdSend className="text-4xl hover:text-primary-hover text-primary-violet w-full" />
        </button>
      </form>
    </div>
  );
};

export default SendMessage;
