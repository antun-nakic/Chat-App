import React from "react";
import Avatar from "react-avatar";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";
import Backdrop from "./Backdrop";

const dropIn = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    opacity: 0,
  },
};

const Modal = ({ user, setOpenModal }) => {
  return (
    <Backdrop onClick={() => setOpenModal(false)}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-[35em] h-[18em] bg-gradient-to-r from-[#252e47] to-[#1c1c32] shadow-2xl  text-white  absolute left-0 right-0 top-0 bottom-0 my-auto mx-auto text-center z-50 rounded-3xl">
        <IoClose
          className="cursor-pointer text-2xl absolute right-10 top-5"
          onClick={() => setOpenModal(false)}
        />
        <div className="justify-center items-center  flex gap-10 h-full ">
          <Avatar src={user.image} name={user.name} size="150" />
          <div className="text-left break-words  ">
            <p className="text-3xl font-bold break-words max-w-xs ">
              {user.name}
            </p>
            <p>
              user id:{" "}
              <span className="font-light">
                #{user.uid.replace(/[^0-9]/g, "")}
              </span>
            </p>
            <p className="mt-5 font-medium">member since:</p>
            <p className="font-light "> {user.memberSince}</p>
          </div>
        </div>
      </motion.div>
    </Backdrop>
  );
};

export default Modal;
