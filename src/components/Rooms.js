import { useState, useEffect } from "react";
// firebase
import {
  collection,
  addDoc,
  serverTimestamp,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "./../firebase";
// redux and react-router-dom
import { Link } from "react-router-dom";
// helper functions
import { checkRoomId } from "../helpers/checkRoomId";
// utility npm package
import { toast } from "react-toastify";
import { uuidv4 } from "@firebase/util";
import Avatar from "react-avatar";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [roomInputField, setRoomInputField] = useState("");

  // create a new room
  const createNewRoom = async (e) => {
    e.preventDefault();
    if (roomInputField === "") {
      toast.warn("Please enter a room name");
      return;
    }
    // add to the firestore database
    const { uid } = auth.currentUser;
    addDoc(collection(db, "rooms"), {
      name: roomInputField,
      uid,
      timestamp: serverTimestamp(),
    });
    setRooms([...rooms, { name: roomInputField, uid }]);
    setRoomInputField("");
  };

  // get all rooms from firestore database
  useEffect(
    () =>
      onSnapshot(
        collection(db, "rooms"),
        orderBy("timestamp", "desc"),
        (snapshot) => {
          setRooms(
            snapshot.docs.map((room) => {
              return {
                id: room.id,
                data: room.data(),
              };
            })
          );
        }
      ),
    []
  );

  return (
    <div className="max-h-[calc(100vh-6.1rem)]   overflow-y-auto overflow-x-hidden">
      <form className="text-black" onSubmit={createNewRoom}>
        <input
          className="bg-transparent border-b border-white border-opacity-30 p-3 text-white w-full focus:outline-none"
          type="text"
          placeholder="room name..."
          value={roomInputField}
          onChange={(e) => setRoomInputField(e.target.value)}
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
              to={`/chat/${checkRoomId(room.id, room?.data?.name)}`}>
              <Avatar
                src={room?.data?.image}
                size={50}
                round="5%"
                maxInitials={2}
                name={room?.data?.name}
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
