import React from 'react';
import Logo from '../assets/logo.png';
import { useState } from 'react';
import toast from 'react-hot-toast'
import { useNavigate } from "react-router";
import {createRoomAPI, joinChatAPI} from '../services/RoomService';
import useChatContext from '../context/ChatContext';
const JoinCreateChat = () => {
    const[detail,setDetail] = useState({
        roomId: "",
        userName: "",
    });

    const{roomId,userName,setRoomId, setCurrentUser, setConnected} = useChatContext();
    const navigate = useNavigate();
    function handleFormInputChange(event){
        setDetail({
            ...detail,
            [event.target.name]: event.target.value,
        });
    }

    function validateForm(){
        if(detail.roomId === "" || detail.userName === ""){
            toast.error("Something is missing!!");
            return false;
    }
    return true;
    }
    async function joinChat(){
        if(validateForm()){
            //Join chat
            try {
                 const room = await joinChatAPI(detail.roomId)
            toast.success("Joined Successfully...Enjoy :)")
            setCurrentUser(detail.userName);
                setRoomId(room.roomId);
                setConnected(true);
                // Chat page forwarding
                navigate("/chat");
            } catch (error) {
                toast.error("Error in joining room");
                console.log(error);
                
            }
        }
    }

    async function createRoom(){
        if(validateForm()){
            //Create room
            console.log(detail);
            //API call to create room in backend
            try{
                const response = await createRoomAPI(detail.roomId);
                console.log(response);
                toast.success("Room Created Successfully");
                // AB join karwa denge
                setCurrentUser(detail.userName);
                setRoomId(detail.roomId);
                setConnected(true);
                // Chat page forwarding
                navigate("/chat");
            }
            catch(error){
                console.log(error);
                if(error.status === 400){
                    toast.error("Room already exists");
                }
                else
                toast.error("Error in creating room");
            }
        }
    }
    return (
    <div className="min-h-screen flex items-center justify-center">
    <div className="p-10 dark:border-gray-700 border w-full flex flex-col gap-5 max-w-md rounded dark:bg-gray-800 shadow">
       
       <div>
        <img src={Logo} alt="Join Room / Create Room" className="w-24 mx-auto" />
       </div>


        <h1 className="text-2xl font-semibold text-center">
            Join Room/Create Room
            </h1>
        {/*Name wala COntent*/}
        <div>
            <label htmlFor="name" className="block font-medium mb-2">
                Your Name
                </label>
                <input 
                onChange={handleFormInputChange}
                value={detail.userName}
                name="userName"
                placeholder="Enter your name"
                type="text" 
                id="name" 
                className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-650 rounded-full focus:outLine-none focus:ring-2 focus:ring-blue-500"
                />
        </div>

        {/*Room Id wala Div*/}
         <div>
            <label htmlFor="name" className="block font-medium mb-2">
               Room ID / New Room ID
                </label>
                <input type="text"
                name="roomId"
                onChange={handleFormInputChange}
                value={detail.roomId}
                placeholder="Enter Room ID" 
                id="name" 
                className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-650 rounded-full focus:outLine-none focus:ring-2 focus:ring-blue-500"
                />
        </div>

        {/*Join Room wala Button*/}
        <div className="flex justify-center gap-3 mt-4">
            <button onClick={joinChat}  className="px-3 py-2 dark:bg-blue-500 hover:dark:bg-blue-850 rounded-full">
                Join Room
            </button>
            <button onClick={createRoom} className="px-3 py-2 dark:bg-orange-500 hover:dark:bg-orange-850 rounded-full">
                Create Room
            </button>
        </div>



    </div>
    </div>
    )
};

export default JoinCreateChat;