import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../store/messageSlice";
import { useSocket } from "../context/SocketContext.jsx";

export default function useGetRealTimeMessage() {
  const { socket } = useSocket();
  const { messages } = useSelector(store => store.message)
  const dispatch = useDispatch();
  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      dispatch(setMessages([...messages, newMessage]))
    })
    return () => socket?.off("newMessage");
  }, [setMessages, messages])
}
