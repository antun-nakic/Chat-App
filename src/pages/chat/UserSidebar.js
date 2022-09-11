import { useState, useEffect } from "react";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import UserList from "./UserList";
import { uuidv4 } from "@firebase/util";

const UserSearchInput = ({ user, handleClickUser }) => {
  const [search, setSearch] = useState("");
  const [userList, setUserList] = useState([]);

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

  return (
    <>
      <div className="mb-5  ">
        <form onSubmit={handleSearchUsers} className="flex  w-full">
          <input
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-b border-white border-opacity-30 p-3 text-white w-full focus:outline-none"
            type="text"
            placeholder="search user"
          />
          <button
            onClick={handleSearchUsers}
            type="submit"
            className="w-32 bg-secondary-violet border-b border-white border-opacity-30 border-l text-white hover:bg-secondary-hover">
            Search
          </button>
        </form>
      </div>
      {userList.map((user) => {
        return (
          <UserList
            key={uuidv4()}
            user={user}
            handleClickUser={handleClickUser}
          />
        );
      })}
    </>
  );
};

export default UserSearchInput;
