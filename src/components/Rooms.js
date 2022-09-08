import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "./../firebase";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../store/features/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { uuidv4 } from "@firebase/util";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [roomImage, setRoomImage] = useState("");

  console.log(rooms);

  const { user } = useSelector(selectUser);
  const dispatch = useDispatch();

  const addRoom = async (e) => {
    e.preventDefault();
    if (roomName === "") {
      toast.warn("Please enter a room name");
      return;
    }

    const { uid } = auth.currentUser;
    await addDoc(collection(db, "rooms"), {
      name: roomName,
      image: roomImage,
      uid,
      timestamp: serverTimestamp(),
    });
    setRooms([...rooms, { name: roomName, image: roomImage, uid }]);
  };

  useEffect(() => {
    const q = query(collection(db, "rooms"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let rooms = [];
      querySnapshot.forEach((doc) => {
        rooms.push(doc.data());
      });
      setRooms(rooms);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="max-h-[calc(100vh-6.1rem)]   overflow-y-auto overflow-x-hidden">
      <form className="text-black" onSubmit={addRoom}>
        <input
          className="bg-transparent border-b border-white border-opacity-30 p-3 text-white w-full focus:outline-none"
          type="text"
          placeholder="room name..."
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button className="w-full bg-secondary-violet py-2 border-b border-white border-opacity-30 border-y text-white hover:bg-secondary-hover">
          Add Room
        </button>
      </form>

      {/* display all rooms */}
      <div className="flex flex-col gap-2 mt-5 ">
        {rooms.map((room) => (
          <li className="text-white   list-none" key={uuidv4()}>
            <Link
              className="flex justify-center  gap-1 overflow-hidden items-center p-3 hover:bg-gray-700"
              to={`/chat/${room.name}`}>
              <Avatar
                src={room.image}
                size={40}
                round="5%"
                maxInitials={2}
                name={room.name}
                textSizeRatio={1.5}
              />
            </Link>
          </li>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
