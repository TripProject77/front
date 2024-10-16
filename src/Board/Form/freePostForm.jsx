import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { LoginContext } from "../../contexts/LoginContextProvider";
import "./PostForm.css";
import { usePostSave } from "./PostSaveProvider";

const PostForm = () => {
  const { isLogin, userInfo } = useContext(LoginContext);
  const navigate = useNavigate();
  const postSave = usePostSave();

  // 이미지 저장
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Choose a file");

  const onPost = (e) => {
    e.preventDefault(); // submit 기본 동작 방지
    const form = e.target;
    const title = form.title.value;
    const content = form.content.value;
    const writer = userInfo?.name;
    const postCategory = "free";

    const formData = new FormData();

    // JSON 형태로 변환
    const postData = {
      title,
      content,
      writer,
      postCategory,
    };

    formData.append(
      "postData",
      new Blob([JSON.stringify(postData)], { type: "application/json" })
    );
    formData.append("postCategory", postCategory);

    // 선택된 이미지 파일 추가
    if (file) {
      formData.append("file", file);
    }

    console.log(postData);

    postSave(formData);
  };

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  useEffect(() => {
    if (!isLogin) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
  }, [isLogin, navigate]);

  return (
    <div>
      <Header />
      <div className="post-insert-form">
        <h1>자유 게시글 작성</h1>
        <hr />
        <form onSubmit={onPost}>
          <table>
            <tbody>
              <tr>
                <td>제목</td>
                <td>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="input-field"
                    placeholder="제목을 입력하세요"
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
                    defaultValue={userInfo?.name}
                    required
                    readOnly
                  />
                </td>
              </tr>

              <tr>
                <td>내용</td>
                <td>
                  <textarea
                    id="content"
                    name="content"
                    className="textarea-field"
                    cols="40"
                    rows="5"
                    placeholder="내용을 입력하세요"
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
                    style={{ display: "none" }}
                  />

                  <label
                    htmlFor="file"
                    className="file-input-label btn btn--form"
                  >
                    {fileName}
                  </label>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="button-container">
            <button className="submit-button">등록</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
