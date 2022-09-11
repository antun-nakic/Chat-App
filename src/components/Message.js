import { auth } from "./../firebase";
import Avatar from "react-avatar";

// message styles
const style = {
  message: ` flex items-center shadow-xl my-5 mx-3 py-2 relative px-4 rounded-tl-full rounded-tr-full `,
  sent: `bg-primary-violet text-white rounded-tr-full float-right rounded-bl-full  rounded-br-none`,
  received: ` bg-secondary-violet text-white  float-left  rounded-tl-full rounded-bl-none rounded-br-full`,
  name: `absolute  mt-[-4rem] mb-3 mx-2  text-white text-xs`,
};

// message styling depending on who sent the message
const Message = ({ message, image }) => {
  const messageClass =
    message.uid === auth.currentUser.uid
      ? ` ${style.sent}`
      : `${style.received}`;

  const nameClass =
    message.uid === auth.currentUser.uid
      ? ` ${style.name} right-0`
      : `${style.name} left-0`;

  const userImages = image.map((image) => {
    if (image.uid === message.uid && image !== undefined) {
      return image.image;
    } else {
      return null;
    }
  });

  const singleUserImage = userImages.filter((image) => image !== null);

  return (
    <div>
      <div>
        <Avatar
          src={singleUserImage.toString()}
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
        <p className={` ${nameClass}`}>{message.name}</p>
        <p>{message.message}</p>
      </div>
    </div>
  );
};

export default Message;
