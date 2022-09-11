import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, signInAnonymously, updateProfile } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { login, selectUser } from "../../store/features/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserPlus, FaSignInAlt, FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const Homepage = () => {
  const [userRegistered, setUserRegistered] = useState(false);
  const { user } = useSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== null) {
      navigate(`/chat`);
    }
  }, [user, userRegistered, navigate]);

  const dispatch = useDispatch();
  const handleGuestLogin = (e) => {
    const idToast = toast.loading("Logging in as guest...");
    e.preventDefault();
    // Sign in annonymously
    signInAnonymously(auth)
      .then((userAuth) => {
        setUserRegistered(true);
        toast.dismiss(idToast);
        // toast.update(idToast, {
        //   render:
        //     "You are now logged in as guest. Please create an account to use all app features.",
        //   type: "success",
        //   isLoading: false,
        //   autoClose: 5000,
        //   closeOnClick: true,
        //   draggable: true,
        // });
        updateProfile(userAuth.user, {
          displayName: "Guest" + Math.floor(Math.random() * 1000),
          photoUrl: "./images/guestProfile.jpg",
        });

        dispatch(
          login({
            uid: userAuth.user.uid,
            displayName: "Guest" + Math.floor(Math.random() * 1000),
            photoUrl: "./images/guestProfile.jpg",
          })
        );
      })
      .catch((err) => {
        toast.dismiss(idToast);
        alert(err);
      });
  };
  return (
    <motion.div
      exit={{ opacity: 0, x: "-100vw", transition: { duration: 0.7 } }}
      className="overflow-hidden">
      <header className="container flex justify-start items-center">
        <h1 className="text-white pt-8 text-xl font-semibold ">ChatTam.</h1>
      </header>
      {/* hero */}
      <main className="mt-10 2xl:mt-24 lg:mt-7 justify-between container flex flex-col md:flex-row items-center">
        {/* left side */}
        <motion.section
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            staggerChildren: 0.5,
          }}
          className="w-full md:w-1/2 ">
          <h1 className=" max-w-full lg:max-w-md 2xl:max-w-full text-3xl lg:text-4xl 2xl:text-[3rem] font-semibold text-center md:text-left text-white leading-[3rem] 2xl:leading-[4.5rem] lg:leading-[3.5rem] mb-5">
            The only chat app you will ever need...
          </h1>
          <p className="text-center md:text-left font-extralight text-xl 2xl:text-3xl lg:text-xl text-white">
            Make an account and start chatting today!
          </p>
          <div className="mt-10 2xl:max-w-xl lg:max-w-[22em]">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                delay: 0.5,
                ease: "easeInOut",
              }}
              className="flex gap-7 2xl:mb-7 mb-5">
              <Link
                className="bg-primary-violet flex justify-center items-center gap-2 text-white text-center hover:bg-primary-hover py-2 w-full  rounded-xl transition duration-300"
                to="../login">
                Login <FaSignInAlt />
              </Link>
              <Link
                className="bg-primary-violet flex justify-center items-center gap-2 text-white text-center hover:bg-primary-hover py-2 w-full rounded-xl transition duration-300 "
                to="../register">
                Register
                <FaUserPlus />
              </Link>
            </motion.div>
            <motion.button
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.5,
                ease: "easeInOut",
              }}
              className="bg-secondary-violet flex justify-center items-center font-medium tracking-wide uppercase gap-2 hover:bg-secondary-hover transition duration-300  rounded-xl text-white py-2 w-full"
              type="submit"
              onClick={handleGuestLogin}>
              Login as guest
              <FaUserCircle />
            </motion.button>
          </div>
        </motion.section>
        {/* right side */}
        <motion.section
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
          className="mt-20 md:mt-0">
          <img
            className="object-cover"
            src="./assets/hero.png"
            alt="chat screen"
          />
        </motion.section>
      </main>
    </motion.div>
  );
};

export default Homepage;
