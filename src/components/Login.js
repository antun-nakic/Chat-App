import { useEffect, useState } from "react";
//firebase
import { auth, signInWithEmailAndPassword } from "../firebase";
// redux and react-router-dom
import { login, selectUser } from "../store/features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
// utility npm
import { toast } from "react-toastify";
import { FaSignInAlt } from "react-icons/fa";
import { motion } from "framer-motion";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // user info
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // redirect to chat if user logged in
  const { user } = useSelector(selectUser);
  useEffect(() => {
    if (user !== null) {
      navigate(`/chat`);
    }
  }, [user, navigate]);

  // login user
  const loginToApp = (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      toast.warn("Please fill in all the fields");
      return;
    }
    const idToast = toast.loading("Logging in...");
    signInWithEmailAndPassword(auth, email, password);
    toast
      .dismiss(idToast)
      .then((userAuth) => {
        dispatch(
          login({
            email: userAuth.user.email,
            uid: userAuth.user.uid,
            displayName: userAuth.user.displayName,
            photoUrl: userAuth.user.photoURL,
          })
        );
      })
      .catch((err) => {
        toast.dismiss(idToast);
        if (err.code === "auth/invalid-email") {
          toast.error("Invalid email");
        } else if (err.code === "auth/internal-error") {
          toast.warning("Please enter correct information");
        } else if (err.code === "auth/user-not-found") {
          toast.error("User does not exist");
        } else if (err.code === "auth/wrong-password") {
          toast.error("Password is incorrect");
        } else {
          toast.error(err.message);
        }
      });
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      duration={0.2}
      ease="easeInOut"
      className="min-h-screen flex flex-col justify-center items-center overflow-hidden">
      {/* LOGIN MODAL*/}
      <motion.div
        initial={{
          opacity: 0,
          x: 100,
        }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5 }}
        className=" shadow-2xl min-w-[25em] ">
        <div className="bg-gradient-to-r from-[#252e47] to-[#1c1c32] py-3 rounded-t-3xl w-full opacity-60 ">
          <h4 className="text-white  tracking-wide font-semibold text-center">
            #LOGIN
          </h4>
        </div>
        <div className="bg-[#141223] p-10 w-full rounded-b-3xl">
          {/* FORM */}
          <form onSubmit={loginToApp} className="flex flex-col">
            {/* email */}
            <label
              className="text-white text-md font-light pl-4 mb-2"
              htmlFor="email">
              Email
            </label>
            <input
              className="bg-[#2D2A46] text-white placeholder:opacity-50 rounded-full px-4 py-2 mb-4 outline-none "
              placeholder="john.doe@gmail.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* password */}
            <label
              className="text-white text-md  font-light pl-4 mb-2"
              htmlFor="password">
              Password
            </label>
            <input
              className="bg-[#2D2A46] placeholder:opacity-50  text-white rounded-full px-4 py-2 mb-4 outline-none"
              placeholder="********"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* submit button */}
            <button
              className="bg-primary-violet transition duration-300 hover:bg-primary-hover rounded-full text-white py-2 w-full mt-4 font-semibold tracking-widest flex justify-center items-center gap-2"
              type="submit"
              onClick={loginToApp}>
              LOGIN
              <FaSignInAlt />
            </button>
          </form>

          {/* REGISTER LINK */}
          <div className="text-center mt-10">
            <span className="text-white ">Not a member? </span>
            <Link
              className="pl-1 text-primary-hover transition duration-300 hover:text-primary-violet "
              to="/register">
              register here
            </Link>
          </div>
          {/* HOMEPAEG LINK */}
          <div className="text-center mt-1">
            <span className="text-white ">Back to </span>
            <Link
              className="pl-1 text-primary-hover transition duration-300 hover:text-primary-violet"
              to="/">
              Homepage
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Login;
