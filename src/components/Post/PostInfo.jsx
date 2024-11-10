import React, { useEffect, useState } from "react";
import { CiCalendar } from "react-icons/ci";
import { FaLocationDot } from "react-icons/fa6";
import { GoTriangleRight } from "react-icons/go";
import { useNavigate, useParams } from "react-router-dom";
import * as auth from "../../api/auth";
import Header from "../Header/Header";
import Modal from "./Modal"; // 모달 컴포넌트 import
import "./PostInfo.css";

const PostInfo = () => {
  const navigate = useNavigate();

  // 게시글 id
  const { id } = useParams();

  const [postInfo, setPostInfo] = useState();
  const [userInfo, setUserInfo] = useState();

  const [postWriterInfo, setPostWriterInfo] = useState();

  const [postImage, setPostImage] = useState(null);
  const [showButtons, setShowButtons] = useState(false);

  // 댓글 입력 값
  const [comment, setComment] = useState("");
  // 댓글 목록
  const [commentsList, setCommentsList] = useState([]);

  // 수정 중인 댓글 ID
  const [editingCommentId, setEditingCommentId] = useState(null);
  // 수정 중인 댓글 텍스트 값
  const [editingCommentText, setEditingCommentText] = useState("");

  // 동행 참여자 수
  const [participationCount, setParticipationCount] = useState(0);

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 사용자 프로필
  const [ProfileImage, setProfileImage] = useState(null);

  // 팔로잉
  const [followingList, setFollowingList] = useState(postWriterInfo?.follow);

  // 팔로워
  const [userList, setUserList] = useState([]);
  const [followerList, setFollowerList] = useState([]);

  // 팔로우 버튼 전환을 위함
  const [loading, setLoading] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleButtons = () => {
    setShowButtons(!showButtons);
  };

  // 현재 로그인 한 사용자 정보 ( 삭제 권한을 체크하기 위함 )
  const getUserInfo = async () => {
    try {
      const response = await auth.info();
      const data = response.data;
      console.log("Fetched userInfo:", data);
      setUserInfo(data);
    } catch (error) {
      console.error("로그인 사용자 정보를 불러올 수 없습니다.:", error);
    }
  };

  const getUserList = async () => {
    try {
      const response = await auth.list();
      const data = response.data;

      const filtered = data.filter((user) =>
        user.userFollowMap?.some(
          (followMap) => followMap.follow.followName === postWriterInfo?.name
        )
      );

      setFollowerList(filtered);
    } catch (error) {
      console.error("유저 리스트를 불러올 수 없습니다.:", error);
    }
  };

  const getPostWriterInfo = async (name) => {
    try {
      const response = await auth.postWriterInfo(name);
      const data = response.data;
      console.log(data);
      setPostWriterInfo(data);
    } catch (error) {
      console.error("게시글 작성자 정보를 불러올 수 없습니다.:", error);
    }
  };

  const fetchProfileImage = async (username) => {
    try {
      const response = await auth.getImage(username);
      const data = response.data;
      console.log("Fetched image URL:", data.url);
      setProfileImage(data.url);
    } catch (error) {
      console.error(
        "로그인 사용자 프로필 이미지를 불러올 수 없습니다.:",
        error
      );
    }
  };

  // 게시물 정보
  const getPostInfo = async (id) => {
    try {
      const response = await auth.postInfo(id);
      const data = response.data;
      setPostInfo(data);
      console.log(data);
    } catch (error) {
      console.error("게시글 정보를 불러올 수 없습니다.:", error);
    }
  };

  // 게시물 수정 - 권한 고려
  const updatePost = async (form) => {
    try {
      const response = await auth.updatePost(form);
      if (response.status === 200) {
        alert("게시글 수정 성공 !!");
      } else {
        alert("게시글 수정 실패 !!");
      }
    } catch (error) {
      console.error("게시글을 수정할 수 없습니다.:", error);
      alert("게시글 수정 중 에러 발생");
    }
  };

  // 게시글 삭제 - 권한 고려
  const deletePost = async (id) => {
    try {
      const check = window.confirm("게시물을 삭제 하시겠습니까 ?");
      if (check) {
        if (!postInfo) {
          alert("게시글 정보를 불러오는 중입니다. 잠시만 기다려주세요.");
          return;
        }

        console.log(userInfo?.username);
        console.log(postInfo.writer);

        // userInfo와 postInfo가 모두 로드된 상태에서만 비교
        // 현재 로그인 한 사용자의 아이디와 게시물 작성자 비교

        if (userInfo?.username === postInfo?.writer) {
          const response = await auth.removePost(id);

          if (response.status === 200) {
            alert("게시글 삭제 성공!");
            navigate("/post");
          } else {
            alert("게시글 삭제 실패!");
          }
        } else {
          // 관리자일 경우 모든 게시물 삭제 가능하게 변경
          if (userInfo?.username === "admin0515") {
            const response = await auth.removePost(id);

            if (response.status === 200) {
              alert("관리자 권한 게시글 삭제 성공!");
              navigate("/post");
            } else {
              alert("관리자 권한 게시글 삭제 실패!");
            }
          } else {
            alert("삭제 권한이 없습니다.");
            navigate("/post");
          }
        }
      } else {
        navigate("/post");
      }
    } catch (error) {
      console.log("게시글 삭제 중 에러 발생", error);
      alert("게시글 삭제 중 에러 발생");
    }
  };

  // 댓글 작성
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }

    try {
      const response = await auth.addComment(id, { comment: comment });

      console.log(comment);

      if (response.status === 200) {
        setComment(""); // 댓글 작성 후 입력란 초기화
        getCommentsList(id); // 댓글 목록 갱신
        alert("댓글 작성 성공 !");
      }
    } catch (error) {
      console.error("댓글을 작성할 수 없습니다:", error);
      alert("댓글 작성 중 에러 발생");
    }
  };

  // 자유 게시글 수정
  const handleFreeEditClick = () => {
    if (userInfo?.username === "admin0515" || userInfo?.name === postInfo?.writer) {
      navigate(`/FreePostUpdateForm`, { state: { postId: postInfo.id } });
    } else {
      if (userInfo?.name !== postInfo?.writer) {
        alert("수정 권한이 없습니다.");
        navigate(`/postInfo/${id}`);
      } else {
        navigate(`/postUpdateForm`, { state: { postId: postInfo.id } });
      }
    }
  };

  // 동행 게시글 수정
  const handleEditClick = () => {
    if (userInfo?.username === "admin0515") {
      navigate(`/PostUpdateForm`, { state: { postId: postInfo.id } });
    } else {
      if (userInfo?.name !== postInfo?.writer) {
        alert("수정 권한이 없습니다.");
        navigate(`/postInfo/${id}`);
      } else {
        navigate(`/postUpdateForm`, { state: { postId: postInfo.id } });
      }
    }
  };

  // 댓글 수정 버튼 클릭 시 수정 상태로 전환
  const handleEditCommentClick = (commentId, currentComment) => {
    setEditingCommentId(commentId); // 수정할 댓글 ID 설정
    setEditingCommentText(currentComment); // 수정할 댓글 내용 설정
  };

  // 댓글 수정 취소
  const handleCancelEdit = () => {
    setEditingCommentId(null); // 수정 중인 댓글 ID 초기화
    setEditingCommentText(""); // 수정할 댓글 내용 초기화
  };

  // 댓글 수정 완료
  const handleUpdateComment = async (commentId) => {
    try {
      const response = await auth.updateComment(commentId, {
        comment: editingCommentText,
      });

      if (response.status === 200) {
        alert("댓글 수정 성공!");
        getCommentsList(id); // 댓글 목록 갱신
        setEditingCommentId(null); // 수정 중인 댓글 ID 초기화
        setEditingCommentText(""); // 수정할 댓글 내용 초기화
      } else {
        alert("댓글 수정 실패!");
      }
    } catch (error) {
      console.error("댓글을 수정할 수 없습니다.:", error);
      alert("댓글 수정 중 에러 발생");
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    try {
      const check = window.confirm("댓글을 삭제하시겠습니까?");
      if (check) {
        const response = await auth.removeComment(commentId);
        if (response.status === 200) {
          alert("댓글 삭제 성공!");

          setCommentsList(
            commentsList.filter((comment) => comment.id !== commentId)
          );
        } else {
          alert("댓글 삭제 실패!");
        }
      }
    } catch (error) {
      console.error("댓글을 삭제할 수 없습니다.:", error);
      alert("댓글 삭제 중 에러 발생");
    }
  };

  // 게시글 댓글 리스트
  const getCommentsList = async (postId) => {
    try {
      const response = await auth.CommentList(postId);
      setCommentsList(response.data);
    } catch (error) {
      console.error("댓글을 불러올 수 없습니다.:", error);
    }
  };

  // LocalDateTime 형의 시각 표시를 보기 편하게 변환
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // 게시글 이미지 로드
  const fetchPostImage = async (postId) => {
    try {
      const response = await auth.getPostImage(postId);
      const data = response.data;
      console.log("Fetched image URL:", data.url);
      setPostImage(data.url);
    } catch (error) {
      console.error("게시글 이미지를 불러올 수 없습니다.:", error);
    }
  };

  // 동행 참여
  const handleParticipate = async () => {
    if (postInfo.writer === userInfo?.name) {
      alert("작성자는 참여할 수 없습니다.");
      return;
    }

    try {
      const response = await auth.participate(id);

      if (response.status === 200) {
        alert("참여 성공!");

        setPostInfo((prev) => ({
          ...prev,
          participation: [...(prev.participation || []), userInfo?.username],
        }));
      } else {
        alert("참여 실패!");
      }
    } catch (error) {
      console.error("동행 참여를 할 수 없습니다.:", error);
      alert("참여 중 에러 발생");
    }
  };

  // 동행 참여 취소
  const handleParticipateCancel = async () => {
    try {
      const response = await auth.participateCancel(id);

      if (response.status === 200) {
        alert("동행 참여 취소 성공!");

        setPostInfo((prev) => ({
          ...prev,
          participation: prev.participation.filter(
            (participant) => participant !== userInfo?.username // userInfo?.username을 제외한 것만 남김
          ),
        }));
      } else {
        alert("참여 취소 실패!");
      }
    } catch (error) {
      console.error("동행 참여 취소를 할 수 없습니다.:", error);
      alert("참여 취소 중 에러 발생");
    }
  };

  // 동행 마감
  const handlePostUpdateStatus = async () => {
    try {
      const response = await auth.postUpdateStatus(id);

      if (response.status === 200) {
        alert("동행이 마감되었습니다 !");
      } else {
        alert("모집 마감 실패!");
      }
    } catch (error) {
      console.error("동행 마감을 할 수 없습니다.:", error);
      alert("모집 마감 중 에러 발생");
    }
  };

  // 팔로우
  const handleFollow = async () => {
    setLoading(true);
    try {
      const response = await auth.follow(postInfo.writer);
      if (response.status === 200) {
        alert("팔로우 성공!");
        setUserInfo((prev) => ({
          ...prev,
          follow: [...(prev.follow || []), postInfo.writer],
        }));
        getUserList(); // 팔로우 성공 시 followerList 갱신
      } else {
        alert("팔로우 실패!");
      }
    } catch (error) {
      console.error("팔로우 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 팔로우 취소
  const handleFollowCancel = async () => {
    setLoading(true);
    try {
      const response = await auth.followCancel(postInfo.writer);
      if (response.status === 200) {
        alert("팔로우 취소 성공!");
        setUserInfo((prev) => ({
          ...prev,
          follow: prev.follow.filter((user) => user !== postInfo.writer),
        }));
        getUserList(); // 팔로우 취소 시 followerList 갱신
      } else {
        alert("팔로우 취소 실패!");
      }
    } catch (error) {
      console.error("언팔로우 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getPostInfo(id);
      getCommentsList(id);
      fetchPostImage(id);
    }
    getUserInfo();
  }, [id]);

  useEffect(() => {
    if (userInfo) {
      getUserList();
    }
  }, [userInfo]);

  useEffect(() => {
    if (postInfo?.writer) {
      getPostWriterInfo(postInfo.writer);
    }
  }, [postInfo?.writer]);

  useEffect(() => {
    if (postInfo && postInfo.participation) {
      setParticipationCount(postInfo.participation.length);
    }
  }, [postInfo]);

  useEffect(() => {
    if (postWriterInfo) {
      if (postWriterInfo?.username) {
        fetchProfileImage(postWriterInfo.username);
      }
      if (postWriterInfo?.follow) {
        setFollowingList(postWriterInfo.follow); // followingList 최신화
      }
      getUserList(); // 다시 followerList 최신화
    }
  }, [postWriterInfo]);

  useEffect(() => {}, [followerList]);

  // postInfo 값이 불러오기 전까지 Loding으로 표시되게
  if (!postInfo || !commentsList) {
    return <div>Loading...</div>;
  }

  // 게시글 목록으로 이동하는 이벤트
  const handlePostClick = () => {
    navigate(`/post`);
  };

  const handleMyPage = () => {
    navigate(`/user`);
  };

  // 지도 이동
  const handleMap = () => {
    navigate(`/kakao/search`, { state: { mapPlace: postInfo.place } });
  };

  console.log(followerList);

  return (
    <>
      <Header />

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="writerInfo-container">
          <div className="writerImage">
            {ProfileImage ? (
              <img
                src={ProfileImage}
                alt="Profile"
                className="writerProfileImage"
              />
            ) : (
              <p>프로필 이미지를 불러올 수 없습니다.</p>
            )}
          </div>

          <div className="writerInfo">
            <p className="writerName">{postWriterInfo?.username}</p>
            <div className="writerDetails">
              <p>{postWriterInfo?.gender}</p> ·{" "}
              <p>
                {postWriterInfo?.age} · {postInfo.mbti}
              </p>
            </div>
          </div>
        </div>
        <p className="writerIntro">{postWriterInfo?.selfIntro}</p>
        <div className="writerFollow">
          <p>
            팔로워 {followerList?.length} · 팔로잉 {followingList?.length}
          </p>
        </div>

        {userInfo &&
          (userInfo?.follow?.includes(postInfo?.writer) ? (
            <button className="followCancelButton" onClick={handleFollowCancel}>
              팔로우 취소
            </button>
          ) : postInfo.writer === userInfo.name ? (
            <button className="followButton" onClick={handleMyPage}>
              마이페이지
            </button>
          ) : (
            <button className="followButton" onClick={handleFollow}>
              팔로우 하기
            </button>
          ))}
      </Modal>

      <div className="postInfo_container">
        <div className="post-header">
          <div className="title-inventory">
            <h3 className="post-title">{postInfo.title}</h3>

            <button
              type="button"
              className="btn--toggle"
              onClick={toggleButtons}
            >
              ···
            </button>
          </div>

          <div className="post-meta">
            <span className="post-author">
              작성자 : {postInfo.writer} &ensp; <GoTriangleRight />
              <span className="profileInfo" onClick={openModal}>
                프로필 확인
              </span>{" "}
            </span>
            <span className="post-count">조회수: {postInfo.count}</span>
          </div>

          <div className="post-dates">
            <span>작성: {formatDate(postInfo.createdDate)}</span>
            <span>수정: {formatDate(postInfo.updatedDate)}</span>
          </div>
        </div>

        <hr />

        {postInfo.postCategory !== "free" && (
          <h5 style={{ marginBottom: "10px" }}>여행 일정</h5>
        )}

        {postInfo.postCategory !== "free" && (
          <div className="info-box" onClick={handleMap}>
            <span>
              <CiCalendar /> {postInfo.startDate} ~ {postInfo.endDate}
            </span>
            <span>
              <FaLocationDot /> {postInfo.place}
            </span>
          </div>
        )}

        <div className="Image">
          {postImage ? (
            <img src={postImage} alt="postImage" className="postInfoImage" />
          ) : (
            <p>이미지를 불러올 수 없습니다.</p>
          )}
        </div>

        <br />

        <div className="post-content">
          {postInfo.postCategory !== "free" && <h5>여행 소개</h5>}

          <br />
          <p>{postInfo.content}</p>
        </div>

        <hr />

        {postInfo.postCategory !== "free" && (
          <>
            <div className="travel-itinerary">
              <h5 style={{ marginBottom: "15px" }}>
                참여중인 동행 ({participationCount}명/
                <span style={{ color: "green" }}>{postInfo.people}명</span>)
              </h5>
              <div>
                {!postInfo.status ? (
                  <>
                    {!postInfo.participation.includes(userInfo?.username) && (
                      <button
                        className="participation-button"
                        onClick={handleParticipate}
                      >
                        동행 참여
                      </button>
                    )}

                    {postInfo.participation.includes(userInfo?.username) && (
                      <button
                        className="participation-button"
                        onClick={handleParticipateCancel}
                      >
                        동행 참여 취소
                      </button>
                    )}

                    {postInfo.writer === userInfo?.name &&
                      postInfo.people === participationCount && (
                        <button
                          className="participation-button"
                          onClick={handlePostUpdateStatus}
                        >
                          모집 마감
                        </button>
                      )}
                  </>
                ) : (
                  <p style={{ marginBottom: "15px", fontSize: "16px" }}>
                    모집이 마감되었습니다 !
                  </p>
                )}
              </div>
            </div>

            <div className="participation">
              <ul style={{ display: "flex", listStyle: "none", padding: 0 }}>
                {postInfo.participation && postInfo.participation.length > 0 ? (
                  postInfo.participation.map((person, index) => (
                    <span key={index} className="participant-name">
                      <li
                        key={index}
                        className="participant-name"
                        style={{ marginRight: "10px" }}
                      >
                        {person}님
                      </li>{" "}
                    </span>
                  ))
                ) : (
                  <p style={{ color: "gray" }}>아직 참여자가 없습니다.</p>
                )}
              </ul>
            </div>
          </>
        )}

        {postInfo.postCategory !== "free" && (
          <div className="hash-tag">
            <ul>
              {postInfo.hashtags && postInfo.hashtags.length > 0 ? (
                postInfo.hashtags.map((tag, index) => (
                  <li key={index}>#{tag}</li>
                ))
              ) : (
                <p style={{ fontSize: "12px" }}>해시태그가 없습니다.</p>
              )}
            </ul>
          </div>
        )}

        {postInfo.postCategory == "free" && (
          <div>
            {showButtons && (
              <div className="post-buttons">
                <button
                  type="submit"
                  className="btn--post"
                  onClick={handleFreeEditClick}
                >
                  게시글 수정
                </button>
                <button
                  type="button"
                  className="btn--post"
                  onClick={() => deletePost(postInfo.id)}
                >
                  게시글 삭제
                </button>
                <button
                  type="button"
                  className="btn--post"
                  onClick={handlePostClick}
                >
                  게시글 목록
                </button>
              </div>
            )}
          </div>
        )}

        {postInfo.postCategory !== "free" && (
          <div>
            {showButtons && (
              <div className="post-buttons">
                <button
                  type="submit"
                  className="btn--post"
                  onClick={handleEditClick}
                >
                  게시글 수정
                </button>
                <button
                  type="button"
                  className="btn--post"
                  onClick={() => deletePost(postInfo.id)}
                >
                  게시글 삭제
                </button>
                <button
                  type="button"
                  className="btn--post"
                  onClick={handlePostClick}
                >
                  게시글 목록
                </button>
              </div>
            )}
          </div>
        )}

        <div className="comments-section">
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="댓글을 입력하세요"
              className="comment-textarea"
              rows="2"
            />
            <button type="submit" className="btn--comment-submit">
              댓글 작성
            </button>
          </form>

          <div className="comments-list">
            {commentsList.map((commentObj) => (
              <div key={commentObj.id} className="comment">
                {editingCommentId === commentObj.id ? (
                  <>
                    {/* 댓글 수정 중일 때의 입력란 */}
                    <textarea
                      value={editingCommentText}
                      onChange={(e) => setEditingCommentText(e.target.value)}
                      className="comment-textarea"
                    />
                    <button
                      onClick={() => handleUpdateComment(commentObj.id)}
                      className="btn--comment-submit"
                    >
                      수정 완료
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="btn--comment-cancel"
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <p>
                      {commentObj.author} : {commentObj.comment}
                    </p>
                    <p className="comment-date">
                      {formatDate(commentObj.createdDate)}
                    </p>

                    <div className="comment-actions">
                      {(userInfo?.username === commentObj.author ||
                        userInfo?.username === "admin0515") && (
                        <>
                          {userInfo?.username === commentObj.author && (
                            <button
                              onClick={() =>
                                handleEditCommentClick(
                                  commentObj.id,
                                  commentObj.comment
                                )
                              }
                            >
                              수정
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteComment(commentObj.id)}
                          >
                            삭제
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostInfo;
