import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import "./MessageBox.css";
import * as auth from "../../api/auth";

const MessageBox = () => {
  const [activeTab, setActiveTab] = useState("received");

  const [sendMessageList, setSendMessageList] = useState([]);
  const [receiveMessageList, setReceiveMessageList] = useState([]);
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

  const getSendMessageList = async () => {
    try {
      const response = await auth.sendedMessage();
      const data = response.data;
      console.log("sendedMessage List:", data);
      setSendMessageList(data);
    } catch (error) {
      console.error("Failed to fetch send list:", error);
    }
  };

  const getReceiveMessageList = async () => {
    try {
      const response = await auth.receiveMessage();
      const data = response.data;
      console.log("ReceivedMessage List:", data);
      setReceiveMessageList(data);
    } catch (error) {
      console.error("Failed to fetch receive list:", error);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const deleteReceiveMessage = async (messageId) => {
    try {
      const check = window.confirm("받은 쪽지를 삭제 하시겠습니까 ?");

      if (check) {
        const response = await auth.deleteReceiveMessage(messageId);
        if (response.status === 200) {
          alert("쪽지 삭제 성공 !!");

          setReceiveMessageList((prevMessages) =>
            prevMessages.filter((message) => message.id !== messageId)
          );
        } else {
          alert("쪽지 삭제 실패 !!");
        }
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
      alert("쪽지 삭제 중 에러 발생");
    }
  };

  const deleteSendMessage = async (messageId) => {
    try {
      const check = window.confirm("보낸 쪽지를 삭제 하시겠습니까 ?");

      if (check) {
        const response = await auth.deleteSendMessage(messageId);
        if (response.status === 200) {
          alert("쪽지 삭제 성공 !!");

          setSendMessageList((prevMessages) =>
            prevMessages.filter((message) => message.id !== messageId)
          );
        } else {
          alert("쪽지 삭제 실패 !!");
        }
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
      alert("쪽지 삭제 중 에러 발생");
    }
  };

  useEffect(() => {
    getSendMessageList();
    getReceiveMessageList();
    getUserInfo();
  }, []);

  return (
    <>
      <Header />

      <div className="messageBox-container">
        <p>쪽지함</p>

        <div className="messageBox-tabs">
          <button
            className={`messageBox-tab-button ${
              activeTab === "received" ? "active" : ""
            }`}
            onClick={() => setActiveTab("received")}
          >
            받은 쪽지
          </button>
          <button
            className={`messageBox-tab-button ${
              activeTab === "sent" ? "active" : ""
            }`}
            onClick={() => setActiveTab("sent")}
          >
            보낸 쪽지
          </button>
        </div>

        <div className="messageBox-tab-content">
          {activeTab === "received" && (
            <div>
              <table>
                <thead className="asd">
                  <tr>
                    <th align="center">보낸 사람</th>
                    <th align="center">제목</th>
                    <th align="center">내용</th>
                    <th align="center">날짜</th>
                    <th align="center">삭제</th>
                  </tr>
                </thead>

                <br></br>

                <tbody>
                  {receiveMessageList
                    .filter((message) => !message.deletedByReceiver)
                    .map((message, index) => (
                      <tr key={index}>
                        <td align="center">{message.senderName}</td>
                        <td align="center">{message.title}</td>
                        <td align="center">{message.content}</td>
                        <td align="center" style={{ color: "gray" }}>
                          {formatDate(message.createdDate)}
                        </td>
                        <td align="center">
                          <button
                            className="btn-message-delete"
                            onClick={() => deleteReceiveMessage(message.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>{" "}
            </div>
          )}
          {activeTab === "sent" && (
            <div>
              <table>
                <thead className="asd">
                  <tr>
                    <th align="center">받은 사람</th>
                    <th align="center">제목</th>
                    <th align="center">내용</th>
                    <th align="center">날짜</th>
                    <th align="center">삭제</th>
                  </tr>
                </thead>

                <br></br>

                <tbody>
                  {sendMessageList
                    .filter((message) => !message.deletedBySender)
                    .map((message, index) => (
                      <tr key={index}>
                        <td align="center">{message.receiverName}</td>
                        <td align="center">{message.title}</td>
                        <td align="center">{message.content}</td>
                        <td align="center" style={{ color: "gray" }}>
                          {formatDate(message.createdDate)}
                        </td>
                        <td align="center">
                          <button
                            className="btn-message-delete"
                            onClick={() => deleteSendMessage(message.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>{" "}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MessageBox;
