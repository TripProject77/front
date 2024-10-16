import React from "react";
import Header from "../components/Header/Header";
import JoinForm from "../components/Join/JoinForm";
import * as auth from "../api/auth";
import { useNavigate } from "react-router-dom";

const Join = () => {
  const navigate = useNavigate();

  // 회원가입 요청

  const join = async (form) => {
    console.log(form);

    let response;
    let data;

    try {
      response = await auth.join(form);
    } catch (error) {
      console.error(`${error}`);
      console.error(`회원가입 중 에러가 발생하였습니다.`);
      alert(`회원가입 중 오류가 발생했습니다 ..!`);
      return;
    }

    data = response.data;
    const status = response.status;
    console.log(`data : ${data}`);
    console.log(`status : ${status}`);

    if (status === 200) {
      console.log(`회원가입 성공 !!`);
      alert(`회원가입 성공 !`);
      navigate("/login");
    } else {
      console.log(`회원가입 실패.. !!`);
      alert(`회원가입 실패.. !!`);
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <JoinForm join={join} />
      </div>
    </>
  );
};

export default Join;
