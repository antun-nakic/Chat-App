import Avatar from "react-avatar";

const UserList = ({ user, handleClickUser }) => {
  return (
    <li
      onClick={() => handleClickUser(user)}
      key={user.uid}
      id={user.uid}
      className="flex text-white items-center space-x-3 mb-2 hover:bg-primary-violet cursor-pointer p-2  transition duration-200 overflox-y-auto">
      <Avatar
        src={user.image}
        name={user.name}
        size="45"
        round={true}
        textSizeRatio={1.5}
      />
      <p className="whitespace-nowrap  break-words text-ellipsis overflow-x-hidden ">
        {user.name}
      </p>

      {user ? (
        <div className="bg-green-500 h-3 w-3 rounded-full"></div>
      ) : (
        <div className="bg-red-500 h-3 w-3 rounded-full"></div>
      )}
    </li>
  );
};

export default UserList;
