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
  const [previewImage, setpreviewImage] = useState(
    "https://i.imgur.com/6VBx3io.png"
  );
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
  const saveUserInformation = async (url) => {
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

  const uploadImage = (e) => {
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
            handleRegister(URL);
          });
        }
      );
    } else {
      handleRegister();
    }
  };

  // add user to db
  const handleRegister = (url) => {
    const idToast = toast.loading("Creating user...");
    createUserWithEmailAndPassword(auth, email, password)
      .then((userAuth) => {
        saveUserInformation(url, idToast);
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
    <div className="bg-hero-pattern bg-cover min-h-screen flex flex-col justify-center items-center">
      <img
        src={previewImage}
        alt="Avatar"
        className="h-40 w-40 rounded-full mb-5"
      />

      {/* REGISTER FORM */}
      <form onSubmit={uploadImage} className="flex flex-col">
        {/* name */}
        <label className="text-white text-lg font-bold mb-2" htmlFor="email">
          Enter username
        </label>
        <input
          className="bg-white rounded-full px-4 mb-4"
          placeholder="Full name (required for registering)"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* email */}
        <label className="text-white text-lg font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          className="bg-white rounded-full px-4 mb-4"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* password */}
        <label className="text-white text-lg font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input
          className="bg-white rounded-full px-4 mb-4"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {/* error */}
        <span
          className="mb-4 ml-1 text-left text-red-500"
          ref={errorFeedback}></span>
        {/* Upload image */}
        <label className="w-full mb-8  flex flex-col items-center px-4 py-2 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-violet-800 cursor-pointer hover:bg-violet-800 hover:text-white">
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
          className="bg-violet-800 hover:bg-violet-700 rounded-xl text-white py-2 w-full"
          type="submit"
          onClick={uploadImage}>
          register
        </button>
      </form>

      {/* LOGIN LINK */}
      <div>
        <span className="text-white">Already a member? </span>
        <Link className="text-violet-400 hover:text-violet-200" to="/login">
          {" "}
          Go back to Login
        </Link>
      </div>
    </div>
  );
};

export default Register;
