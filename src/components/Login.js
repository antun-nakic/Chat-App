import { useEffect, useState } from "react";
//firebase
import { auth, signInWithEmailAndPassword } from "../firebase";
// redux and react-router-dom
import { login, selectUser } from "../context/features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
// utility npm
import { toast } from "react-toastify";

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
    signInWithEmailAndPassword(auth, email, password)
      .then((userAuth) => {
        if (toast) {
          toast.update(idToast, {
            render: "You are now logged in.",
            type: "success",
            isLoading: false,
            autoClose: 2000,
            closeOnClick: true,
            draggable: true,
          });
        }

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
    <div className="bg-hero-pattern bg-cover min-h-screen flex flex-col justify-center items-center">
      {/* LOGIN FORM */}
      <form onSubmit={loginToApp} className="flex flex-col">
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
        />

        {/* submit button */}
        <button
          className="bg-violet-800 hover:bg-violet-700 rounded-xl text-white py-2 w-full"
          type="submit"
          onClick={loginToApp}>
          Login
        </button>
      </form>

      {/* REGISTER LINK */}
      <div>
        <span className="text-white">Not a member? </span>
        <Link className="text-violet-400 hover:text-violet-200" to="/register">
          register here
        </Link>
      </div>
    </div>
  );
}

export default Login;
