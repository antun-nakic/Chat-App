import Avatar from "react-avatar";
import { auth } from "../../firebase";

const UserInfo = ({ user, handleClickUser }) => {
  const logoutOfApp = () => {
    auth.signOut();
  };

  return (
    <>
      <div
        onClick={() => handleClickUser(user)}
        className="relative cursor-pointer ">
        <Avatar
          src={user.photoUrl ? user.photoUrl : ""}
          size={40}
          round="50%"
          maxInitials={2}
          name={user.displayName}
          textSizeRatio={1.5}
        />
        <div className="bg-green-500 w-3 h-3 rounded-full absolute top-0 -right-0.5"></div>
      </div>
      <div>
        <p className="font-semibold ">{user.displayName}</p>
        <p className="font-light text-center">
          #{user.uid.replace(/[^0-9]/g, "")}
        </p>
      </div>

      <button
        className="ml-auto bg-primary-violet py-2 px-6 items-center justify-center hover:bg-primary-hover rounded-xl"
        onClick={logoutOfApp}>
        Logout
      </button>
    </>
  );
};

export default UserInfo;
