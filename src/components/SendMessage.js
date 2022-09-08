import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./../firebase";
import { MdSend } from "react-icons/md";

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
    <div className="mt-auto pt-6 z-20 bg-hero-pattern bg-cover bg-bottom fixed bottom-0 w-[65%] 2xl:w-[65.7%] pb-7 px-20">
      <form onSubmit={sendMessage} className=" w-full  flex text-xl ">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full text-base p-3 bg-transparent text-white border rounded-2xl border-white border-opacity-30 h-14 placeholder-white placeholder-opacity-40 font-light focus:outline-none"
          type="text"
          placeholder="Write a message..."
        />
        <button className="w-[10%] ">
          <MdSend className="text-4xl hover:text-primary-hover text-primary-violet w-full" />
        </button>
      </form>
    </div>
  );
};

export default SendMessage;
