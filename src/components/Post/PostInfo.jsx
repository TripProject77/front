import React, { useEffect, useState } from "react";
import { CiCalendar } from "react-icons/ci";
import { FaLocationDot } from "react-icons/fa6";
import { GoTriangleRight } from "react-icons/go";
import { useNavigate, useParams } from "react-router-dom";
import * as auth from "../../api/auth";
import Header from "../Header/Header";
import "./PostInfo.css";


const PostInfo = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [postInfo, setPostInfo] = useState();
  const [userInfo, setUserInfo] = useState();
  const [comment, setComment] = useState(""); // 댓글 입력 값 상태
  const [commentsList, setCommentsList] = useState([]); // 댓글 목록 상태

  const [editingCommentId, setEditingCommentId] = useState(null); // 수정 중인 댓글 ID
  const [editingCommentText, setEditingCommentText] = useState(""); // 수정 중인 댓글 텍스트

  const [postImage, setPostImage] = useState(null);

  const [showButtons, setShowButtons] = useState(false);


  console.log(id);

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
      console.error("Failed to fetch user info:", error);
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
      console.error("Failed to fetch post info:", error);
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
      console.error("Failed to update post info:", error);
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
      console.error("Failed to add comment:", error);
      alert("댓글 작성 중 에러 발생");
    }
  };

  // 게시글 수정
  const handleEditClick = () => {
    if (userInfo?.username === "admin0515") {
      navigate(`/postUpdateForm`, { state: { postId: postInfo.id } });
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
      console.error("Failed to update comment:", error);
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
      console.error("Failed to delete comment:", error);
      alert("댓글 삭제 중 에러 발생");
    }
  };

  // 게시글 댓글 리스트
  const getCommentsList = async (postId) => {
    try {
      const response = await auth.CommentList(postId);
      setCommentsList(response.data);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
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
      console.error("Error fetching post image:", error);
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

  // postInfo 값이 불러오기 전까지 Loding으로 표시되게
  if (!postInfo || !commentsList) {
    return <div>Loading...</div>;
  }

  // 게시글 목록으로 이동하는 이벤트
  const handlePostClick = () => {
    navigate(`/post`);
  };

  const handleMap = () => {
    navigate(`/kakao/search`, { state: { mapPlace: postInfo.place } });
  };

  return (
    <>
      <Header />

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
              작성자: {postInfo.writer} <GoTriangleRight />{" "}
              <span className="profileInfo">프로필 확인</span>
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
            <h5 style={{marginBottom:"10px"}}>여행 일정</h5>
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
            <img src={postImage} alt="postImage" className="postImage" />
          ) : (
            <p>이미지를 불러올 수 없습니다.</p>
          )}
        </div>

        <br />

        <div className="post-content">

          {postInfo.postCategory !== "free" && (
            <h5>여행 소개</h5>
          )}

          <br />
          <p>{postInfo.content}</p>
        </div>

        <hr />

        {postInfo.postCategory !== "free" && (
          <>
          <div className="travel-itinerary">
            <h5 style={{marginBottom:"15px"}}>참여중인 동행</h5>
            <button className="participation-button">동행 참여</button>
          </div>
          <div className="participation">

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
                <p style={{fontSize:"12px"}}>해시태그가 없습니다.</p>
              )}
            </ul>
          </div>
        )}

<div>
      {/* --- 버튼, 클릭하면 버튼들이 토글됩니다 */}
      

      {/* 버튼들, 상태에 따라 표시 */}
      {showButtons && (
        <div className="post-buttons">
          <button type="submit" className="btn--post" onClick={handleEditClick}>
            게시글 수정
          </button>
          <button
            type="button"
            className="btn--post"
            onClick={() => deletePost(postInfo.id)}
          >
            게시글 삭제
          </button>
          <button type="button" className="btn--post" onClick={handlePostClick}>
            게시글 목록
          </button>
        </div>
      )}
    </div>

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

                    {/* 댓글 수정, 삭제, 대댓글 버튼 */}
                    <div className="comment-actions">
                      {/* 수정, 삭제 버튼은 작성자와 관리자가 볼 수 있음 */}
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
                    {commentObj.replies && (
                      <div className="replies-list">
                        {commentObj.replies.map((reply) => (
                          <div key={reply.id} className="reply">
                            <p>
                              {reply.author} : {reply.comment}
                            </p>
                            <p className="reply-date">
                              {formatDate(reply.createdDate)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
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
