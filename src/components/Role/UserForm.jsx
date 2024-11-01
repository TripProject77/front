import React, { useEffect, useState } from "react";
import * as auth from "../../api/auth";
import { useNavigate } from "react-router-dom";
import "./UserForm.css";
import { LuPencilLine } from "react-icons/lu";
import { BsPencilSquare } from "react-icons/bs";
import { CiCalendar } from "react-icons/ci";
import { LuSubtitles } from "react-icons/lu";
import { TbPencilCheck } from "react-icons/tb";

export const UserForm = ({ userInfo, updateUser }) => {
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState(null);
  const [activeTab, setActiveTab] = useState("post");
  const [postList, setPostList] = useState([]);
  const [postPartiList, setPostPartiList] = useState([]);

  const [filteredPosts, setFilteredPosts] = useState([]); // 내가 작성한 post
  const [filteredPartiPosts, setFilteredPartiPosts] = useState([]); //

  console.log(filteredPartiPosts);

  const getPostList = async () => {
    try {
      const response = await auth.postList();
      const data = response.data;

      const filtered = data.filter(
        (post) =>
          post.postCategory === "together" && post.writer === userInfo?.name
      );

      setPostList(filtered);
      setFilteredPosts(filtered);
    } catch (error) {
      console.error("Failed to fetch post list:", error);
    }
  };

  const getPostPartiList = async () => {
    try {
      const response = await auth.postList();
      const data = response.data;
  
      const filteredParti = data.filter(
        (post) =>
          post.postCategory === "together" &&
          Array.isArray(post.participation) && 
          post.participation.includes(userInfo?.name)
      );
  
      console.log("Filtered participation posts:", filteredParti);
  
      setPostPartiList(filteredParti);
      setFilteredPartiPosts(filteredParti);
    } catch (error) {
      console.error("Failed to fetch post list:", error);
    }
  };

  const handlePostWriteClick = () => {
    navigate(`/post-write`);
  };

  const handlePostClick = (postId) => {
    navigate(`/postInfo/${postId}`);
  };

  useEffect(() => {
    if (userInfo?.username) {
      fetchProfileImage(userInfo.username);
      getPostList();
      getPostPartiList();
    }
  }, [userInfo]);

  const fetchProfileImage = async (username) => {
    try {
      const response = await auth.getImage(username);
      setProfileImage(response.data.url);
    } catch (error) {
      console.error("Error fetching profile image:", error);
    }
  };

  console.log(userInfo?.gender)


  return (
    <div className="userInfoContainer">
      <div className="userInfoForm">
        <div className="login-wrapper">
          <div className="info">
            <div className="Profile">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="HomeProfileImage"
                />
              ) : (
                <p>프로필 이미지를 불러올 수 없습니다.</p>
              )}
            </div>
            <div className="userInfo">
              <p className="username">{userInfo?.username}</p>
              <p className="email">{userInfo?.email}</p>
              <div className="userInfo-info" style={{ display: "flex" }}>
                <p className="age">
                  {userInfo?.age} · {userInfo?.gender}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="my_self_wrapper">
          <div className="my_self">
            {userInfo?.selfIntro ? (
              <p>{userInfo?.selfIntro}</p>
            ) : (
              <p>자기소개를 입력해보세요 !</p>
            )}
          </div>
          <button
            className="btn_my_self"
            onClick={() => navigate(`/UserUpdate`)}
          >
            자기소개 작성
          </button>
        </div>

        <button
          className="update_user_btn"
          onClick={() => navigate(`/UserUpdate`)}
        >
          <LuPencilLine /> 프로필 수정
        </button>

        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "post" ? "active" : ""}`}
            onClick={() => setActiveTab("post")}
          >
            포스트
          </button>
          <button
            className={`tab-button ${
              activeTab === "participation" ? "active" : ""
            }`}
            onClick={() => setActiveTab("participation")}
          >
            참여한 동행
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "post" && (
            <div className="userInfo-post">
              {filteredPosts.length > 0 ? (
                <div className="postCards">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      className="postCard"
                      onClick={() => handlePostClick(post.id)}
                    >
                      <p>
                        {" "}
                        <LuSubtitles className="icon" /> {post.title}
                      </p>
                      <p style={{ fontSize: "12px", color: "gray" }}>
                        <CiCalendar className="icon" /> {post.startDate} ~{" "}
                        {post.endDate}
                      </p>
                      <p style={{ fontSize: "12px", color: "gray" }}>
                        {" "}
                        {new Date(post.createdDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <p>아직 작성한 동행글이 없습니다.</p>
                  <p>동행 글을 작성해보세요 !</p>
                  <button
                    className="user-post-btn"
                    onClick={handlePostWriteClick}
                  >
                    동행글 작성
                  </button>
                </>
              )}
            </div>
          )}
          {activeTab === "participation" && (
            <div className="userInfo-post">
              {filteredPartiPosts.length > 0 ? (
                <div className="postCards">
                  {filteredPartiPosts.map((post) => (
                    <div
                      key={post.id}
                      className="postCard"
                      onClick={() => handlePostClick(post.id)}
                    >
                      <p>
                        {" "}
                        <LuSubtitles className="icon" /> {post.title}
                      </p>
                      <p style={{ fontSize: "12px", color: "gray" }}>
                        <CiCalendar className="icon" /> {post.startDate} ~{" "}
                        {post.endDate}
                      </p>
                      <p style={{ fontSize: "12px", color: "gray" }}>
                        {" "}
                        {new Date(post.createdDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <p>아직 참여한 동행이 없습니다.</p>
                  <p>동행에 참여해보세요 !</p>
                  <button className="user-post-btn" onClick={handlePostClick}>
                    동행 참여
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
