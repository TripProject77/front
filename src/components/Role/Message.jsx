import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import { useLocation } from "react-router-dom";
import "./Message.css";
import * as auth from "../../api/auth";

const Message = () => {
  const location = useLocation();
  const user = location.state?.user;

  const [userInfo, setUserInfo] = useState();

  const getUserInfo = async () => {
    try {
      const response = await auth.info();
      const data = response.data;
      setUserInfo(data);
    } catch (error) {
      console.error("로그인 사용자 정보를 불러올 수 없습니다.:", error);
    }
  };

  const messageWrite = async (message) => {

    let response;
    let data;

    try {
      response = await auth.messageWrite(message);
    } catch (error) {
      console.error(`${error}`);
      console.error(`쪽지 작성 중 에러 발생`);
      alert(`쪽지 작성 중 오류 발생`);
      return;
    }

    data = response.data;
    const status = response.status;
    console.log(data);
    console.log(`status : ${status}`);

    if (status === 200) {
      console.log(`쪽지 작성 성공`);
      alert("쪽지 작성 성공");
    } else {
      console.log(`쪽지글 작성 실패`);
      alert("쪽지 작성 실패");
    }
  };

  const onMessage = (e) => {
    e.preventDefault(); // submit 기본 동작 방지

    const form = e.target;

    const title = form.title.value.trim();
    const receiverName = form.receiverName.value.trim();
    const senderName = userInfo?.name;
    const content = form.content.value.trim();

    const message = {
      title: title,
      receiverName: receiverName,
      senderName: senderName,
      content: content,
    };

    messageWrite(message);
  };

  useEffect(() => {
    getUserInfo();
}, []); 


  return (
    <>
      <Header />
      <form className="message-form" onSubmit={(e) => onMessage(e)}>
        <div className="messageContainer">
          <p>쪽지 보내기</p>

          <div>
            <input
              type="text"
              id="title"
              className="title"
              placeholder="제목"
              name="title"
              autoComplete="title"
              required
            />
          </div>

          <div>
            <input
              type="text"
              id="receiverName"
              className="receiverName"
              placeholder="받는 사람"
              name="receiverName"
              defaultValue={user}
              autoComplete="receiverName"
              required
            />
          </div>

          <textarea
            id="content"
            name="content"
            className="content"
            cols="40"
            rows="5"
            placeholder="내용을 입력하세요"
            required
          />

          <div className="message-button-group">
            <button className="message-send-button">작성</button>
          </div>
        </div>
      </form>
    </>
  );
};

export default Message;
