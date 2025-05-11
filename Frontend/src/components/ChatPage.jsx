import React, { useEffect, useRef, useState } from 'react';
import { MdAttachFile, MdSend } from 'react-icons/md';
import avanish from '../assets/Avanish.jpg';
import aastha from '../assets/Aastha.jpg';
import useChatContext from '../context/ChatContext';
import { useNavigate } from 'react-router';
import SockJS from 'sockjs-client';
import { baseURL } from '../config/AxiosHelper';
import toast from "react-hot-toast";
import { Stomp } from '@stomp/stompjs';
import { getMessages } from '../services/RoomService';
import { timeAgo } from '../config/helper';

const ChatPage = () => {

    const{roomId,currentUser,connected,setConnected,setRoomId,setCurrentUser} = useChatContext();

    const navigate = useNavigate()
    useEffect(() => {
        if(!connected)
        navigate("/")
    },[connected,roomId,currentUser])
    const[messages,setMessage] = useState([]);
const[input,setInput] = useState([]);
const inputRef = useRef(null);
const chatBoxRef = useRef(null);
const[stompClient,setStompClient] = useState(null);

//Load old messages
useEffect(() => {
async function loadMessages(){
    try {
        const messages = await getMessages(roomId)
        setMessage(messages);
        
    } catch (error) {
        
    }
}if(connected){
    loadMessages()
}
},[])

//Auto Scroll Down
useEffect(() => {
    if(chatBoxRef.current){
        chatBoxRef.current.scroll({
            top:chatBoxRef.current.scrollHeight,
            behavior : "smooth",
        })
    }
},[messages])

// Stomp client connection
    useEffect(() => {
    const connectWebSocket = () => {
      ///SockJS
      const sock = new SockJS(`${baseURL}/chat`);
      const client = Stomp.over(sock);

      client.connect({}, () => {
        setStompClient(client);

        toast.success("connected");

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          console.log(message);

          const newMessage = JSON.parse(message.body);

          setMessage((prev) => [...prev, newMessage]);

          //rest of the work after success receiving the message
        });
      });
    };

    if (connected) {
      connectWebSocket();
    }

    //stomp client
  }, [roomId]);


    //send message function 

    const sendMessage = async()=>{
        if(stompClient && connected && input.trim()) {
            console.log(input);

            const message = {
                sender: currentUser,
                content: input,
                roomId: roomId,
            }
            stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
            setInput("")
        }
    }

    //Logout Function
    function hadnleLogout(){
        stompClient.disconnect();
        setConnected(false);
        setRoomId('')
        setCurrentUser('')
        toast.success("Disconnected (:")
        navigate('/')
    }
    return <div className="">
        {/*Header wala Div*/}
        <header className=" dark:bg-gray-900 fixed w-full dark:bg-gray-750 py-5 flex justify-around items-center">
            {/*Room Name COntainer*/}
            <div >
                <h1 className="text-2xl font-semibold ">
                    Room : <span>{roomId}</span>
                </h1>
            </div>

            {/*Username Container*/}
            <div>
                <h1 className="text-2xl font-semibold ">
                    User : <span>{currentUser}</span>
                </h1>
            </div>

            {/*Leave Room Button*/}
            <div>
                <button onClick={hadnleLogout} className="dark:bg-red-500 dark:hover:bg-red-800 px-3 py-3 rounded-full">Leave Room</button>
            </div>
        </header>

        {/*Main Chatbox*/}
        <main 
        ref={chatBoxRef}
        className="py-20 px-10 border w-2/3 dark:bg-slate-600 mx-auto h-screen overflow-auto">
            {
                messages.map((message,index) => (
                    <div key={index} 
                    className={`flex ${
                        message.sender===currentUser?"justify-end":"justify-start"}`}
                        >
                        <div  className={`' ${message.sender===currentUser? 'bg-green-400':'bg-pink-300'} p-2 my-3 max-w-xs rounded'`}>
                        <div className='flex flex-row gap-2'>
                            <img  className="h-12 w-12 rounded-full" src={message.sender === 'Avanish' ? avanish: aastha} alt={message.sender} />
                            <div className=' flex flex-col gap-2'>
                            <p className="text -sm font-bold">{message.sender}</p>
                            <p>{message.content}</p>
                            <p className='text-xm text-gray-500'>{timeAgo(message.timeStamp)}</p>
                        </div>
                        </div>
                    </div>
                    </div>
                ))
            }
        </main>

        {/*Input Message wala Div*/}
        <div className="fixed bottom-2 w-full h-16">
              <div className="h-full pr-10 gap-4 flex items-center justify-between rounded w-1/2 mx-auto dark:bg-gray-900">
                <input 
                 value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onKeyDown={(e) =>{
                if(e.key === "Enter"){
                    sendMessage();
                }
            }}
                 type="text" placeholder="Type message here..." className="dark:bg-gray-800 dark:border-gray-600 b w-full px-5 py-2 rounded-full h-full focus:outline-none focus:ring-0"  />
                <div className='flex gap-2'>
                    <button className="dark:bg-pink-600 h-16 w-16 flex justify-center items-center rounded-full">
                    <MdAttachFile size={30}/>
                    </button>
                    <button 
                    onClick={sendMessage} 
                    className="dark:bg-green-600 h-16 w-16 flex justify-center items-center rounded-full">
                    <MdSend size={30}/>
                    </button>
                </div>
              </div>
        </div>
    </div>
};

export default ChatPage;