import { useState, useEffect } from "react";
//firebase
import { query, collection, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
// redux and react-router-dom
import { selectUser } from "../../store/features/userSlice";
import { useSelector } from "react-redux";
import DynamicChatPage from "../../routes/DynamicChatPage";
// components
import Rooms from "./Rooms";
import Modal from "../../components/Modal";
import UserInfo from "./UserInfo";
import UserSidebar from "./UserSidebar";
// util npm package
import { AnimatePresence, motion } from "framer-motion";
import { Sling as Hamburger } from "hamburger-react";

const Homepage = () => {
  const { user } = useSelector(selectUser);
  const [image, setImage] = useState([""]);
  const [messages, setMessages] = useState([]);
  const [singleUserInfo, setSingleUserInfo] = useState([""]);
  const [openModal, setOpenModal] = useState(false);
  const [toggleMobileMenu, setToggleMobileMenu] = useState(false);

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

  const handleClickUser = (user) => {
    setSingleUserInfo(user);
    setOpenModal(true);
  };

  return (
    <>
      <div className="flex min-h-screen ">
        {/* MOBILE SIDEBAR */}
        <section className="md:hidden block ">
          <div className=" absolute top-3 left-5 z-50">
            <Hamburger
              color="#fff"
              toggled={toggleMobileMenu}
              toggle={() => setToggleMobileMenu((prev) => !prev)}
            />
          </div>
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{
              x: toggleMobileMenu ? "0" : "-100%",
              opacity: toggleMobileMenu ? 1 : 0,
            }}
            exit={{
              x: "-100%",
              opacity: 0,
            }}
            transition={{ duration: 0.5 }}
            ease="easeInOut"
            className={` absolute z-40 w-full  left-0 top-0 ${
              toggleMobileMenu ? "block" : "hidden "
            } `}>
            {toggleMobileMenu && (
              <>
                <div className="bg-secondary-violet text-white text-center pl-20 pr-10 pt-3  pb-5">
                  <div className="flex gap-3 items-center  justify-start  ">
                    <UserInfo user={user} />
                  </div>
                </div>
                <div className="w-full bg-gradient-to-b from-[#1c2232] to-[#18182a] flex ">
                  <div className="w-1/2">
                    <Rooms />
                  </div>
                  <div className="min-h-[calc(100vh-6.1rem)] max-h-[calc(100vh-6.1rem)] bg-gradient-to-b from-[#121021] to-[#1c1a31] border-x border-white border-opacity-30  w-full overflow-auto">
                    <UserSidebar
                      user={user}
                      handleClickUser={handleClickUser}
                    />
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </section>
        {/* END MOBILE SIDEBAR */}
        <AnimatePresence>
          {openModal && (
            <Modal user={singleUserInfo} setOpenModal={setOpenModal} />
          )}
        </AnimatePresence>
        {/* DESKTOP SIDEBAR */}
        <section className="hidden md:block w-1/2">
          {/* profile info */}
          <div className="text-white bg-gradient-to-r from-[#1c2232] to-[#18182a] flex justify-center border-opacity-30 items-center p-6 gap-7 border-b border-r  border-white ">
            <UserInfo user={user} handleClickUser={handleClickUser} />
          </div>
          <div className="flex ">
            {/* chat room*/}
            <div className="w-1/2 bg-gradient-to-b from-[#1c2232] to-[#18182a] ">
              <Rooms />
            </div>
            {/* user list */}
            <div className="min-h-[calc(100vh-6.1rem)] max-h-[calc(100vh-6.1rem)] bg-gradient-to-b from-[#121021] to-[#1c1a31] border-x border-white border-opacity-30  w-full overflow-auto">
              <UserSidebar user={user} handleClickUser={handleClickUser} />
            </div>
          </div>
        </section>
        {/* chat */}
        <section className="bg-hero-pattern bg-cover w-full min-h-screen ">
          <DynamicChatPage messages={messages} image={image} />
        </section>
      </div>
    </>
  );
};

export default Homepage;
