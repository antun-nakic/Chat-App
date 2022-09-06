import { auth } from "./../firebase";
import Avatar from "react-avatar";

const style = {
  message: `flex items-center shadow-xl my-4 mx-2 py-2 px-3 rounded-tl-full rounded-tr-full `,
  sent: `bg-[#395dff] text-white rounded-tr-full float-right rounded-bl-full  rounded-br-none`,
  received: `bg-gray-200 text-gray-800 float-left rounded-tl-full rounded-bl-none rounded-br-full`,
  name: `absolute mt-[-4rem] text-black text-xs`,
};

const Message = ({ message, image }) => {
  const messageClass =
    message.uid === auth.currentUser.uid
      ? `${style.sent}`
      : `${style.received}`;

  const userImageMap = image.map((image) => {
    if (image.uid === message.uid && image !== undefined) {
      return image.image;
    } else {
      return null;
    }
  });

  const filteredArrayOfImages = userImageMap.filter((image) => image !== null);

  return (
    <div>
      <div>
        <Avatar
          src={filteredArrayOfImages.toString()}
          className={` ${
            message.uid === auth.currentUser.uid
              ? "float-right  mt-2.5 "
              : "float-left mt-2.5"
          } `}
          size={40}
          round="50%"
          maxInitials={2}
          name={message.name}
          textSizeRatio={1.5}
        />
      </div>
      <div className={`${style.message} ${messageClass}`}>
        <p className={`${style.name}`}>{message.name}</p>
        <p>{message.text}</p>
      </div>
    </div>
  );
};

export default Message;
