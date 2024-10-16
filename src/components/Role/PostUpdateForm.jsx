import React, { useEffect, useContext, useState } from "react";
import Header from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import * as auth from "../../api/auth";

const PostUpdateForm = () => {
  const location = useLocation();
  const { postId } = location.state;
  console.log(postId);

  const [postInfo, setPostInfo] = useState();

  const navigate = useNavigate();

  const getPostInfo = async (postId) => {
    try {
      const response = await auth.postInfo(postId);
      const data = response.data;
      setPostInfo(data);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch post info:", error);
    }
  };

  const updatePost = async (form) => {
    try {
      const response = await auth.updatePost({ ...form, id: postInfo.id });

      if (response.status === 200) {
        alert("게시글 수정 성공 !!");
        navigate(`/postInfo/${postId}`);
      } else {
        alert("게시글 수정 실패 !!");
        navigate(`/postInfo/${postId}`);
      }
    } catch (error) {
      console.error("Failed to update post info:", error);
      alert("게시글 수정 중 에러 발생");
      navigate(`/postInfo/${postId}`);
    }
  };

  const onUpdatePost = (e) => {
    e.preventDefault();
    const form = e.target;

    const title = form.title.value;
    const content = form.content.value;

    updatePost({ title, content });
  };

  useEffect(() => {
    if (postId) {
      getPostInfo(postId);
    }
  }, [postId]);

  if (!postInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <div className="board-insert-form">
        <h1>게시글 수정</h1>
        <hr />
        <form onSubmit={(e) => onUpdatePost(e)}>
          <table>
            <tbody>
              <tr>
                <td>제목</td>
                <td>
                  <input
                    id="title"
                    name="title"
                    className="input-field"
                    defaultValue={postInfo.title}
                    required
                  />
                </td>
              </tr>

              <tr>
                <td>작성자</td>
                <td>
                  <input
                    id="writer"
                    name="writer"
                    className="input-field"
                    defaultValue={postInfo?.writer}
                    required
                  />
                </td>
              </tr>

              <tr>
                <td>내용</td>
                <td>
                  <input
                    id="content"
                    name="content"
                    className="input-field"
                    defaultValue={postInfo.content}
                    required
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="button-container">
            <button className="submit-button">수정</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostUpdateForm;
