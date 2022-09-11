import { Link } from "react-router-dom";
// helper functions
import { checkRoomId } from "../../helpers/checkRoomId";
// utility npm package
import { uuidv4 } from "@firebase/util";
import Avatar from "react-avatar";

const RoomList = ({ room }) => {
  return (
    <li className="text-white   list-none" key={uuidv4()}>
      <Link
        className="flex justify-center  gap-1 overflow-hidden items-center p-3 hover:bg-gray-700"
        to={`/chat/${checkRoomId(room.id, room?.data?.name)}`}>
        <Avatar
          src={room?.data?.image}
          size={50}
          round="5%"
          maxInitials={2}
          name={room?.data?.name}
          textSizeRatio={1.5}
        />
      </Link>
    </li>
  );
};

export default RoomList;
