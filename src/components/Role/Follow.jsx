import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import "./Follow.css";
import * as auth from "../../api/auth";

const Follow = () => {
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
          (followMap) => followMap.follow.followName === userInfo.name
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
      } else {
        alert("팔로우 취소 실패!");
      }
    } catch (error) {
      console.error("언팔로우 실패:", error);
    }
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
                    <p className="user-name"> · {user.name}</p>
                    <button
                      className="follow-button"
                      onClick={() => handleFollowCancel(user.name)} // user.name 전달
                      >
                      팔로우 취소
                    </button>
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
                  <div className="follow-card">
                    <p className="user-name"> · {user}</p>
                    <button className="follow-button">팔로우 취소</button>
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
