import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import { IMessageSendTypes } from "../types/messageType";
import { getUserInfo } from "../features/userInfo";
import { getMessageHeartApi, sendMessageApi } from "../features/api/messageApi";
import HeartwritingSelectHeart from "../components/heartwrting/HeartwritingSelectHeart";
import HeartwritingMessage from "../components/heartwrting/HeartwritingMessage";
import { getProfile } from "../features/api/userApi";
import LogoEffect from "../assets/images/logo/logo_effect.png";

function Heartwriting() {
  const navigate = useNavigate();

  const [heartList, setHeartList] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [selectedHeartId, setSelectedHeartId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  let params = new URL(document.URL).searchParams;
  let userId = params.get("id");
  
  const getUserProfile = useCallback(
    async (userId: string | null) => {
      if (!userId) {
        // console.log("에러났당");
        navigate("/notfound");
      } else {
        const data = await getProfile(userId);
        if (data.status !== "success") {
          // console.log("에러났당");
          navigate("/notfound");
        }
      }
    },
    [navigate]
    );
    
    const onReturnHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsSelected(false)
    }
    const onSendHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!userId) return;
      const messageInfo: IMessageSendTypes = {
        heartId: Number(selectedHeartId),
        senderId: getUserInfo().userId,
        receiverId: userId,
        title: title,
        content: content,
      };
      
      const data = await sendMessageApi(messageInfo);
      if (data.status === "success") {
        alert("메세지가 전송되었습니다");
        navigate(`/heartboard/user?id=${userId}`);
        const socket = io("https://heart-ing.com", { path: "/ws" });
        if (socket && socket.connected) {
            socket.emit("send-message", userId, data.data);
            console.log("알람보내용");
      } else {
        console.log("웹소켓 서버에 먼저 연결하세요");
      }
    }
  };

  async function getHeartList() {
    const data = await getMessageHeartApi();
    if (data.status === "success") {
      setHeartList(data.data.heartList);
    }
  }

  function setHeartNumber(heartId: string) {
    setSelectedHeartId(heartId);
  }

  function setMode() {
    setIsSelected(!isSelected);
  }

  useEffect(() => {
    getUserProfile(userId);
    getHeartList();
    setIsSelected(false);
  }, [userId, getUserProfile]);

  return (
    <div className="fullHeight container mx-auto px-6 fullHeight justify-between flex-col">
      <div className="flex flex-col justify-center items-center h-28">
        <img src={LogoEffect} alt="test" className=" px-14" />
      </div>
      <div className="heartBoard border-hrtColorPink flex-col justify-center items-center writingHeight">
        <div className="heartBoard-header bg-hrtColorPink w-full z-10 mb-2">
          하트 보내기
        </div>
        <div className="flex-col py-4 writingDetailHeight overflow-auto">
          {isSelected ? (
            <HeartwritingMessage
              setTitle={setTitle}
              setContent={setContent}
              onSettingMode={setMode}
              selectedHeartInfo={heartList[Number(selectedHeartId) - 1]}
              userId={userId}
              isSelected={isSelected}
            />
          ) : (
            <HeartwritingSelectHeart
              onHeartNumberHandler={setHeartNumber}
              onSettingMode={setMode}
              heartList={heartList}
              isSelected={isSelected}
            />
          )}
        </div>
      </div>
      <div className="flex justify-center items-center h-28">
        {isSelected ? (
          <div className="flex w-full justify-center">
          <button
            onClick={onReturnHandler}
            className='mr-8 p-auto h-16 w-16 rounded-xl border-2 bg-hrtColorYellow border-hrtColorPink shadow-[0_4px_4px_rgba(251,139,176,1)]'
          >
          <div className="text-2xl">{`<`}</div>
          </button>
          <button
            onClick={onSendHandler}
            disabled={title ? false : true}
            className={`px-8 h-16 w-48 rounded-xl border-2 ${title ? 'bg-hrtColorYellow border-hrtColorPink shadow-[0_4px_4px_rgba(251,139,176,1)]' : 'bg-gray-200 border-gray-300 shadow-[0_4px_4px_rgba(182,182,182,1)] text-white'}`}
          >
            <div className="text-2xl">전달하기</div>
          </button>
          </div>
        ) : (
          <button
            onClick={setMode}
            className={`px-8 h-16 w-48 rounded-xl border-2 ${selectedHeartId ? 'bg-hrtColorYellow border-hrtColorPink shadow-[0_4px_4px_rgba(251,139,176,1)]' : 'bg-gray-200 border-gray-300 shadow-[0_4px_4px_rgba(182,182,182,1)] text-white'}`}
            disabled={selectedHeartId ? false : true}
          >
            <div className="text-2xl">다 음</div>
          </button>
        )}
      </div>
    </div>
  );
}

export default Heartwriting;
