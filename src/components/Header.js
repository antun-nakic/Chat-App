import { auth } from "../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../store/features/userSlice";

function Header() {
  const { user } = useSelector(selectUser);
  console.log(user);
  const logoutOfApp = () => {
    auth.signOut();
    // call logout from redux
  };

  return (
    <div className="w-full h-20 bg-black bg-hero-pattern  text-white flex items-center">
      <h2 className="text-white text-3xl ml-auto pl-10">
        user: {user.displayName}
      </h2>
      <button
        className="ml-auto mr-20 bg-violet-800 hover:bg-violet-600 px-10 py-2 rounded-xl"
        onClick={logoutOfApp}>
        Logout
      </button>
    </div>
  );
}

export default Header;
