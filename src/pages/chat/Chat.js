import {
  query,
  collection,
  orderBy,
  onSnapshot,
  where,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useState, useEffect, useRef } from "react";
import Message from "../../components/Message";
import SendMessage from "../../components/SendMessage";
import Avatar from "react-avatar";
import { RiSettings5Fill } from "react-icons/ri";
import { selectUser } from "../../store/features/userSlice";
import { useSelector } from "react-redux";
import Rooms from "../../components/Rooms";
import DynamicPage from "../../routes/DynamicPage";
import { motion } from "framer-motion";

const Homepage = () => {
  const [image, setImage] = useState([""]);
  const [messages, setMessages] = useState([]);
  const scroll = useRef(null);
  const { user } = useSelector(selectUser);
  const [userList, setUserList] = useState([]);
  const [search, setSearch] = useState("");
  // new stuff
  const [isOpen, setIsOpen] = useState(false);
  console.log(isOpen);
  // get all users from firestore database
  const getAllUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "userInfo"));
    const users = querySnapshot.docs.map((doc) => doc.data());
    setUserList(users);
  };

  const logoutOfApp = () => {
    auth.signOut();
  };

  useEffect(() => {
    getAllUsers();
  }, [user]);

  const handleSearchUsers = async (e) => {
    e.preventDefault();
    const q = query(
      collection(db, "userInfo"),
      where("name", ">=", search),
      where("name", "<=", search + "\uf8ff")
    );

    try {
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map((doc) => doc.data());
      if (users.length > 0) {
        setUserList(users);
      } else {
        getAllUsers();
      }
    } catch (error) {
      console.log(error);
    }
    if (search === "") {
      getAllUsers();
    }
  };

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

  const handleSelectUser = async () => {};

  return (
    <>
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        duration={0.2}
        ease="easeInOut"
        className="flex min-h-screen ">
        <section className=" w-1/2">
          {/* profile info */}
          <div className="text-white bg-gradient-to-r from-[#1c2232] to-[#18182a] flex justify-center border-opacity-30 items-center p-6 gap-7 border-b border-r  border-white ">
            <div className="relative ">
              <Avatar
                // src={user.photoUrl ? user.photoUrl : ""}
                size={40}
                round="50%"
                maxInitials={2}
                name={user.displayName}
                textSizeRatio={1.5}
              />
              <div className="bg-green-500 w-3 h-3 rounded-full absolute top-0 -right-0.5"></div>
            </div>
            <div>
              <p className="font-semibold">{user.displayName}</p>
              <p className="font-light">#{user.uid.replace(/[^0-9]/g, "")}</p>
            </div>

            <button
              className="ml-auto bg-primary-violet py-2 px-6 items-center justify-center hover:bg-primary-hover rounded-xl"
              onClick={logoutOfApp}>
              Logout
            </button>
          </div>
          <div className="flex ">
            {/* chat room*/}
            <div className="w-1/2 bg-gradient-to-b from-[#1c2232] to-[#18182a] ">
              <Rooms />
            </div>
            {/* user list */}
            <div
              className="h-[calc(100vh-6.1rem)] 
            bg-gradient-to-b from-[#121021] to-[#1c1a31] border-x border-white border-opacity-30  w-full overflow-y-auto">
              <div className="mb-5  ">
                <form onSubmit={handleSearchUsers} className="flex  w-full">
                  <input
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent border-b border-white border-opacity-30 p-3 text-white w-full focus:outline-none"
                    type="text"
                    placeholder="search user"
                  />
                  <button
                    onClick={handleSearchUsers}
                    type="submit"
                    className="w-32 bg-secondary-violet border-b border-white border-opacity-30 border-l text-white hover:bg-secondary-hover">
                    Search
                  </button>
                </form>
              </div>

              {userList.map((user) => {
                return (
                  <div
                    onClick={handleSelectUser}
                    key={user.uid}
                    id={user.uid}
                    className="flex text-white items-center space-x-3 mb-2 hover:bg-primary-violet cursor-pointer p-2  transition duration-200 ">
                    <Avatar
                      src={user.image}
                      name={user.name}
                      size="45"
                      round={true}
                    />
                    <p className="whitespace-nowrap  break-words text-ellipsis overflow-x-hidden ">
                      {user.name}
                    </p>

                    {user ? (
                      <div className="bg-green-500 h-3 w-3 rounded-full"></div>
                    ) : (
                      <div className="bg-red-500 h-3 w-3 rounded-full"></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/*  end user ist */}
          </div>
        </section>
        {/* chat */}
        <section className="bg-hero-pattern bg-cover w-full min-h-screen ">
          <DynamicPage messages={messages} scroll={scroll} image={image} />
        </section>
      </motion.div>
    </>
  );
};

export default Homepage;
