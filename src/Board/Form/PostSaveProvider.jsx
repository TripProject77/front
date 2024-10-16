import React, { createContext, useContext } from "react";
import PostForm from "./PostForm";
import { useNavigate } from "react-router-dom"; // navigate 추가
import * as auth from "../../api/auth"; // auth 모듈 추가

const PostSaveContext = createContext();

export const PostSaveProvider = ({ children }) => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const postSave = async (form) => {
    console.log(form);

    let response;
    let data;
    let postCategory = form.get("postCategory");
    console.log(postCategory);

    try {
      response = await auth.postSave(form);
    } catch (error) {
      console.error(`${error}`);
      console.error(`게시글 등록 중 에러 발생`);
      alert(`게시글 작성 중 오류 발생`);
      return;
    }

    data = response.data;
    const status = response.status;
    console.log(data);
    console.log(`status : ${status}`);

    if (status === 200) {
      console.log(`게시글 작성 성공`);
      alert("게시글 작성 성공");

      if (postCategory == "free") {
        navigate("/postCom");
      } else {
        navigate("/post");
      }
    } else {
      console.log(`게시글 작성 실패`);
      alert("게시글 작성 실패");

      if (postCategory == "free") {
        navigate("/postCom");
      } else {
        navigate("/post");
      }
    }
  };

  return (
    <>
      <PostSaveContext.Provider value={postSave}>
        {children}
      </PostSaveContext.Provider>
    </>
  );
};

export const usePostSave = () => useContext(PostSaveContext);
