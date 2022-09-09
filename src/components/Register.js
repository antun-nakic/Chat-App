import { useEffect, useState, useRef } from "react";
//firebase
import {
  auth,
  createUserWithEmailAndPassword,
  updateProfile,
  storage,
  db,
} from "../firebase";
import { collection, addDoc } from "firebase/firestore";
// redux and react router
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, selectUser } from "../store/features/userSlice";
// utility npm
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { FaUserPlus } from "react-icons/fa";
import { motion } from "framer-motion";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const errorFeedback = useRef(null);
  // user info
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  // user image
  const [image, setimage] = useState("");
  const [previewImage, setpreviewImage] = useState("./assets/guestProfile.jpg");
  const onImageChange = (img) => {
    setimage(img);
    setpreviewImage(URL.createObjectURL(img));
  };

  // redirect to chat if user logged in
  const { user } = useSelector(selectUser);
  useEffect(() => {
    if (user !== null) {
      navigate(`/chat`);
    }
  }, [user, navigate]);

  // add user data
  const saveUserInformationToDB = async (url) => {
    const { uid } = auth.currentUser;
    if (url === null || url === undefined) {
      url = "";
    }
    await addDoc(collection(db, "userInfo"), {
      name: name,
      uid,
      image: url,
      isOnline: true,
    });
  };

  // upload image & get url
  const metadata = { contentType: "image/jpeg " };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name === "" || password === "" || email === "") {
      // set timeout to the message
      errorFeedback.current.innerHTML = "Please fill in all the fields";
      errorFeedback.current.style.display = "block";
      setTimeout(() => {
        errorFeedback.current.style.display = "none";
      }, 5000);

      toast.warn("Please fill in all the fields");
      return;
    }

    if (name.length < 3 || name.length > 14) {
      errorFeedback.current.innerHTML =
        "Username must be between 3 and 14 characters";
      errorFeedback.current.style.display = "block";
      setTimeout(() => {
        errorFeedback.current.style.display = "none";
      }, 5000);
      toast.warn("Username must be between 3 and 14 characters");
      return;
    }

    const idToast = toast.loading("Creating user...");
    if (image) {
      const storageRef = ref(storage, `userimages/${uuidv4()}`);
      const uploadTask = uploadBytesResumable(storageRef, image, metadata);
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((URL) => {
            handleRegister(idToast, URL);
          });
        }
      );
    } else {
      handleRegister(idToast);
    }
  };

  // add user to db
  const handleRegister = (idToast, url) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userAuth) => {
        saveUserInformationToDB(url, idToast);
        updateProfile(userAuth.user, {
          displayName: name,
          photoURL: url,
        }).then(
          toast.update(idToast, {
            render: "User created successfully",
            type: "success",
            isLoading: false,
            autoClose: 2000,
            closeOnClick: true,
            draggable: true,
          }),
          dispatch(
            login({
              email: userAuth.user.email,
              uid: userAuth.user.uid,
              displayName: name,
              photoURL: url,
            })
          )
        );
      })
      .catch((err) => {
        toast.dismiss(idToast);
        errorFeedback.current.style.display = "block";
        setTimeout(() => {
          errorFeedback.current.style.display = "none";
        }, 3000);
        if (err.code === "auth/invalid-email") {
          toast.error("Invalid email");
          errorFeedback.current.innerHTML = "Invalid email";
        } else if (err.code === "auth/email-already-in-use") {
          toast.error("Email already in use");
          errorFeedback.current.innerHTML = "Email already in use";
        } else if (err.code === "auth/internal-error") {
          toast.error("Please enter correct information");
          errorFeedback.current.innerHTML = "Please enter correct information";
        } else if (err.code === "auth/weak-password") {
          toast.error("Password must be at least 6 characters");
          errorFeedback.current.innerHTML =
            "Password must be at least 6 characters";
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
      duration={0.2}
      exit={{ opacity: 0 }}
      transition={{ type: "tween", duration: 0.8 }}
      className="min-h-screen  flex flex-col justify-center items-center scroll overflow-hidden">
      <motion.div
        initial={{
          opacity: 0,
          x: 100,
        }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5 }}
        className=" shadow-2xl min-w-[27em]">
        <div className="bg-gradient-to-r from-[#252e47] to-[#1c1c32] py-3 rounded-t-3xl w-full opacity-60 ">
          <h4 className="text-white  tracking-wide font-semibold text-center">
            #REGISTER
          </h4>
        </div>
        <div className="bg-[#141223]  px-10 pt-7 pb-6 w-full rounded-b-3xl">
          <div className="flex justify-center items-center  ">
            <img
              src={previewImage}
              alt="Avatar"
              className="h-16 w-16 rounded-full hidden md:block "
            />
          </div>
          {/* REGISTER FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col">
            {/* name */}
            <label
              className="text-white text-md font-light pl-4 mb-2"
              htmlFor="username">
              Username
            </label>
            <input
              title="Must be between 3-14 characters"
              className="bg-[#2D2A46] text-white placeholder:opacity-50 rounded-full px-4 py-1 2xl:py-2 mb-4 outline-none "
              placeholder="john doe"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            {/* email */}
            <label
              className="text-white text-md font-light pl-4 mb-2"
              htmlFor="email">
              Email
            </label>
            <input
              title="Must be a valid email"
              className="bg-[#2D2A46] text-white placeholder:opacity-50 rounded-full px-4 py-1 2xl:py-2 mb-4 outline-none "
              placeholder="john.doe@gmail.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required></input>

            {/* password */}
            <label
              className="text-white text-md  font-light pl-4 mb-2"
              htmlFor="password">
              Password
            </label>
            <input
              title="Must have at least 6 characters"
              className="bg-[#2D2A46] placeholder:opacity-50  text-white rounded-full px-4 py-1 2xl:py-2 mb-4 outline-none"
              placeholder="Must have at least 6 characters"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* error */}
            <div
              className="mb-2 ml-1  text-left text-red-500"
              ref={errorFeedback}></div>
            {/* Upload image */}
            <label className="w-full mb-4 mt-3  transition duration-300 flex-col items-center px-4 py-2 bg-[#2D2A46] text-white rounded-full shadow-lg tracking-wide uppercase cursor-pointer hover:bg-primary-hover hover:text-white hidden md:flex">
              <div className="flex justify-center items-center gap-5">
                <svg
                  className="w-7 h-7"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20">
                  <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                </svg>
                <span className=" text-base leading-normal">
                  Upload profile image
                </span>
              </div>
              <input
                type="file"
                className="hidden"
                onChange={(e) => onImageChange(e.target.files[0])}
              />
            </label>

            {/* submit button */}
            <button
              className="bg-primary-violet transition duration-300  hover:bg-primary-hover rounded-full text-white py-2 w-full mt-4 font-semibold tracking-widest flex justify-center items-center gap-2"
              type="submit"
              onClick={handleSubmit}>
              REGISTER
              <FaUserPlus />
            </button>
          </form>

          {/* LOGIN LINK */}
          <div className="text-center mt-5">
            <span className="text-white">Already a member? </span>
            <Link
              className="pl-2 text-primary-hover transition duration-300 hover:text-primary-violet"
              to="/login">
              {" "}
              Go to Login
            </Link>
          </div>
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
};

export default Register;
