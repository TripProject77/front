import React, { useEffect, useContext, useState } from "react";
import Header from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import * as auth from "../../api/auth";

const FreePostUpdateForm = () => {
  const location = useLocation();
  const { postId } = location.state;

  const [postInfo, setPostInfo] = useState();
  const navigate = useNavigate();

  // 이미지 저장
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(
    postInfo?.postImageurl || "choose a update image"
  );

  const onUpdatePost = (e) => {
    e.preventDefault();
    const form = e.target;

    const title = form.title.value;
    const content = form.content.value;

    const formData = new FormData();

    const postUpdateData = {
      title,
      content,
    };

    if (file) {
      formData.append("file", file);
    }

    formData.append(
      "postUpdateData",
      new Blob([JSON.stringify(postUpdateData)], { type: "application/json" })
    );

    updateFreePost(formData);
  };

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

  const updateFreePost = async (formData) => {
    try {
      const response = await auth.updateFreePost(postId, formData);
      
      if (response.status === 200) {
        alert("게시글 수정 성공 !!");
        navigate(`/postInfo/${postId}`);
      } else {
        alert("게시글 수정 실패 !!");
      }
    } catch (error) {
      console.error("Failed to update post info:", error);
      alert("게시글 수정 중 에러 발생");
    }
  };

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
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
      <div className="free-update-form">
        <h2>게시글 수정</h2>
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

              <tr>
                <td>게시글 이미지</td>
                <td>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    accept="image/*"
                    onChange={onFileChange}
                    defaultValue={postInfo?.postImageurl}
                    style={{ display: "none" }}
                  />

                  <label htmlFor="file" className="image-btn">
                    {fileName}
                  </label>
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

export default FreePostUpdateForm;
