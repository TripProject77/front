import React, { useEffect, useContext, useState } from "react";
import Header from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import * as auth from "../../api/auth";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";

const PostUpdateForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { postId } = location.state;

  const [postInfo, setPostInfo] = useState();
  const [startDate, setStartDate] = useState(); // 여행 시작 일
  const [endDate, setEndDate] = useState(); // 여행 마지막 일

  // 이미지 저장
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(
    postInfo?.postImageurl || "choose a update image"
  );

  const onUpdatePost = (e) => {
    e.preventDefault();
    const form = e.target;

    const startDate = form.startDate.value;
    const endDate = form.endDate.value;
    const title = form.title.value;
    const content = form.content.value;
    const mbti = form.mbti.value;
    const place = form.place.value;

    const formData = new FormData();

    const postUpdateData = {
      startDate,
      endDate,
      title,
      content,
      mbti,
      place
    };

    if (file) {
      formData.append("file", file);
    }

    formData.append(
      "postUpdateData",
      new Blob([JSON.stringify(postUpdateData)], { type: "application/json" })
    );

    updatePost(formData);
  };

  // 날짜 선택 핸들러
  const changeDate = (e) => {
    const startDateFormat = moment(e[0]).format("YYYY/MM/DD");
    const endDateFormat = moment(e[1]).format("YYYY/MM/DD");
    setStartDate(startDateFormat);
    setEndDate(endDateFormat);
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

  const updatePost = async (formData) => {
    try {
      const response = await auth.updatePost(postId, formData);

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
                <td>여행기간</td>
                <td>
                  <Calendar
                    onChange={changeDate}
                    selectRange={true}
                    formatDay={(locale, date) => moment(date).format("DD")}
                  />

                  <div className="date-input-container">
                    <input
                      type="text"
                      className="start-date"
                      name="startDate"
                      placeholder="출발일"
                      value={startDate || ""}
                      disabled
                    />
                    <input
                      type="text"
                      className="end-date"
                      name="endDate"
                      placeholder="귀국일"
                      value={endDate || ""}
                      disabled
                    />
                  </div>
                </td>
              </tr>

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

              <tr>
                <td>MBTI</td>
                <td>
                  <input
                    type="text"
                    id="mbti"
                    name="mbti"
                    className="input-field"
                    defaultValue={postInfo?.mbti}
                  />
                </td>
              </tr>

              <tr>
                <td>여행지</td>
                <td>
                  <input
                    type="text"
                    id="place"
                    name="place"
                    className="input-field"
                    defaultValue={postInfo?.place}
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
