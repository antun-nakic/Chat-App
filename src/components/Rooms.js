import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./../firebase";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../store/features/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { uuidv4 } from "@firebase/util";
import { Link } from "react-router-dom";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [roomImage, setRoomImage] = useState("www.http://placehold.it/200x200");

  const { user } = useSelector(selectUser);
  const dispatch = useDispatch();

  const addRoom = async (e) => {
    e.preventDefault();
    if (roomName === "") {
      toast.warn("Please enter a room name");
      return;
    }
    if (roomImage === "") {
      toast.warn("Please enter a room image");
      return;
    }
    const { uid } = auth.currentUser;
    await addDoc(collection(db, "rooms"), {
      name: roomName,
      image: roomImage,
      uid,
      timestamp: serverTimestamp(),
    });
    setRoomName("");
    setRoomImage("");
  };

  const getRooms = async () => {
    const querySnapshot = await getDocs(collection(db, "rooms"));
    querySnapshot.forEach((doc) => {
      setRooms((prev) => [...prev, doc.data()]);
    });
  };

  useEffect(() => {
    getRooms();
  }, []);

  return (
    <div className="ml-[30rem] mt-80">
      <form className="text-black" onSubmit={addRoom}>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button className="bg-white">Add Room</button>
      </form>

      {/* display all rooms */}
      <div className="flex flex-col">
        {rooms.map((room) => (
          <li className="text-white" key={uuidv4()}>
            <Link to={`/rooms/${room.name}`}>
              <img src={room.image} alt="" />
              <h1>{room.name}</h1>
            </Link>
          </li>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
