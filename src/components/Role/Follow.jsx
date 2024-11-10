import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import "./Follow.css";
import * as auth from "../../api/auth";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const Follow = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("follower");
  const [userInfo, setUserInfo] = useState();

  const [followerList, setFollowerList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  const getUserInfo = async () => {
    try {
      const response = await auth.info();
      const data = response.data;
      console.log("Fetched userInfo:", data);
      setUserInfo(data);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  const getFollowerList = async () => {
    try {
      const response = await auth.list();
      const data = response.data;

      const followers = data.filter((user) =>
        user.userFollowMap?.some(
          (followMap) => followMap.follow.followName === userInfo?.name
        )
      );

      setFollowerList(followers);
    } catch (error) {
      console.error("Failed to fetch follow data:", error);
    }
  };

  const getFollowingList = async () => {
    try {
      const followingData = userInfo?.follow;

      // followingData가 존재하지 않으면 빈 배열로 설정
      if (!followingData) {
        setFollowingList([]);
        return;
      }

      setFollowingList(followingData);
    } catch (error) {
      console.error("Failed to fetch following list:", error);
    }
  };

  // 팔로우 취소
  const handleFollowCancel = async (writerName) => {
    try {
      const response = await auth.followCancel(writerName);

      if (response.status === 200) {
        alert("팔로우 취소 성공!");

        setUserInfo((prev) => ({
          ...prev,
          follow: prev.follow.filter((user) => user !== writerName),
        }));
        getFollowerList();
      } else {
        alert("팔로우 취소 실패!");
      }
    } catch (error) {
      console.error("언팔로우 실패:", error);
    }
  };

  const handleMessage = (user) => {
    navigate('/Message', { state: { user } });
  };

  useEffect(() => {
    const fetchData = async () => {
      await getUserInfo();
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (userInfo) {
      getFollowerList();
      getFollowingList();
    }
  }, [userInfo]);

  if (!followerList && !userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="followContainer">
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "follower" ? "active" : ""}`}
            onClick={() => setActiveTab("follower")}
          >
            팔로워
          </button>
          <button
            className={`tab-button ${
              activeTab === "following" ? "active" : ""
            }`}
            onClick={() => setActiveTab("following")}
          >
            팔로잉
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "follower" && (
            <div className="follow-list">
              {followerList.length > 0 ? (
                followerList.map((user) => (
                  <div key={user.id} className="follow-card">
                    <p className="user-name">
                      <span className="icon-and-name">
                        <FaRegUserCircle className="user-icon" /> {user.name}
                      </span>
                    </p>
                  </div>
                ))
              ) : (
                <p className="followMsg">팔로워가 없습니다.</p>
              )}
            </div>
          )}
          {activeTab === "following" && (
            <div className="follow-list">
              {followingList.length > 0 ? (
                followingList.map((user) => (
                  <div className="follow-card" key={user}>
                    <p className="user-name">
                      <span className="icon-and-name">
                        <FaRegUserCircle className="user-icon" /> {user}
                      </span>
                    </p>
                    <div>
                    <button
                      className="follow-button"
                      onClick={() => handleFollowCancel(user)}
                    >
                      팔로우 취소
                    </button>
                    <button
                      className="message-button"
                      onClick={() => handleMessage(user)}
                    >
                      쪽지 작성
                    </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="followMsg">팔로잉한 사용자가 없습니다.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Follow;
