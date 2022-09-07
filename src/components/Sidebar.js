import { selectUser } from "../store/features/userSlice";
import { useSelector } from "react-redux";
import Avatar from "react-avatar";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";

const Sidebar = () => {
  const { user } = useSelector(selectUser);
  const [userList, setUserList] = useState([]);
  const [search, setSearch] = useState("");

  // get all users from firestore database
  const getAllUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "userInfo"));
    const users = querySnapshot.docs.map((doc) => doc.data());
    setUserList(users);
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

  const handleSelectUser = async () => {};

  return (
    <div className="h-full fixed bg-black text-white w-[23rem] ">
      <div className="bg-zinc-300 h-20 text-black">
        <Avatar
          src={user.photoUrl}
          size={40}
          round="50%"
          name={user.displayName}
        />
        <h1 className="text-black">{user.displayName}</h1>
      </div>
      <div className="flex flex-1 justify-between items-center">
        <div className="bg-slate-400 h-screen w-20">Chat rooms</div>
        <div className="bg-slate-800 h-screen w-full max-w-xs overflow-y-auto border-2 border-red-500 ">
          <div className="mb-5 ">
            <form onSubmit={handleSearchUsers} className="flex h-10 w-full">
              <input
                onChange={(e) => setSearch(e.target.value)}
                className=" text-black w-full"
                type="text"
                placeholder="search user"
              />
              <button
                onClick={handleSearchUsers}
                type="submit"
                className="w-32 bg-black text-white">
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
                className="flex items-center space-x-3 mb-2 hover:bg-gray-200 cursor-pointer p-2 rounded-xl ">
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
      </div>
    </div>
  );
};

export default Sidebar;
