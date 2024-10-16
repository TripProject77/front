import React, { useEffect, useState } from "react";
import api from "../api/api";
import Cookies from "js-cookie";
import * as auth from "../api/auth";
import { useNavigate } from "react-router-dom";

export const LoginContext = React.createContext();
LoginContext.displayName = "LoginContextName";

/* 
    로그인, 로그인 체크, 로그아웃 
*/

const LoginContextProvider = ({ children }) => {
  // 로그인 여부
  const [isLogin, setIsLogin] = useState(false);

  // 유저 정보
  const [userInfo, setUserInfo] = useState({});

  // 권한
  const [roles, setRoles] = useState({ isUser: false, isAdmin: false });

  // 유저 아이디 저장
  const [rememberUsername, setRememberUsername] = useState();

  const navigate = useNavigate(); // 페이지 이동을 위함

  // 쿠키에 jwt 있는지 확인
  // jwt로 사용자 정보 요청
  const loginCheck = async () => {
    const accessToken = Cookies.get("accessToken");
    console.log(`accessToken : ${accessToken}`);

    // header에 jwt 담음

    if (!accessToken) {
      console.log(`쿠키에 accessToken 없음`);
      logoutSetting();
      return;
    }

    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    let response;
    let data;

    try {
      response = await auth.info();
      data = response.data;
      console.log(`data : ${data}`);

      if (data == "UNAUTHORIZED" || response.status == 401) {
        console.error(`accessToken이 만료되거나 인증 실패되었습니다.`);
        return;
      }
      console.log(`accessToken으로 사용자 정보 요청 성공`);

      // 인증이 성공되면
      loginSetting(data, accessToken);
    } catch (error) {
      console.log(`error : ${error}`);

      // error가 발생했을 경우 response 객체가 없으므로 status를 참조하지 않도록 변경
      if (error.response && error.response.status) {
        console.log(`status : ${error.response.status}`);
      }

      return;
    }
  };

  const login = async (username, password) => {
    console.log(`username : ${username}`);
    console.log(`password : ${password}`);

    try {
      const response = await auth.login(username, password);
      const data = response.data;
      const status = response.status;
      const headers = response.headers;
      const authorization = headers.access;

      console.log(`data : ${data}`);
      console.log(`status : ${status}`);
      console.log(`headers : ${headers}`);
      console.log(`acceessToken : ${authorization}`);

      if (status === 200) {
        // 쿠키에 accessToken 저장
        Cookies.set("accessToken", authorization);

        loginCheck();
        alert(`로그인 성공`);

        // 메인 페이지 이동
        navigate("/");
      }
    } catch (error) {
      // 로그인 실패
      alert(`로그인 실패되었습니다..!`);
    }
  };

  // 로그인 세팅
  const loginSetting = (userData, accessToken) => {
    const { username, role, name, email, password } = userData;

    console.log(`username: ${username}`);
    console.log(`role : ${role}`);
    console.log(`name : ${name}`);
    console.log(`email : ${email}`);
    console.log(`password : ${password}`);

    // axios 객체의 header( 'Bearer ${토큰}' )
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    // 로그인 여부 변환
    setIsLogin(true);

    // 유저 정보 세팅
    const updatedUserInfo = { username, role, name, email, password };
    setUserInfo(updatedUserInfo);

    // 권한 정보 세팅
    const updatedRoles = { isUser: false, isAdmin: false };

    if (role === "ROLE_USER") {
      updatedRoles.isUser = true;
    } else if (role === "ROLE_ADMIN") {
      updatedRoles.isAdmin = true;
    }

    setRoles(updatedRoles);
  };

  const logoutSetting = () => {
    // axios 헤더 초기화
    api.defaults.headers.common.Authorization = undefined;

    // 쿠키 초기화
    Cookies.remove("accessToken");

    // 로그인 여부
    setIsLogin(false);

    // 유저 정보 초기화
    setUserInfo(null); // 확인: 이 상태가 초기화 되는지

    setRoles({ isUser: false, isAdmin: false }); // 확인: 권한이 기본값으로 초기화되는
  };

  const logout = () => {
    const check = window.confirm("로그아웃 하시겠습니까 ?");

    if (check) {
      logoutSetting();
      navigate("/");
    }
  };

  // 탈퇴할 때 쓰는 logout 함수
  const DeleteLogout = () => {
    logoutSetting();
    navigate("/");
  };

  useEffect(() => {
    // 로그인 체크
    loginCheck();
  }, []);

  return (
    <LoginContext.Provider
      value={{ isLogin, userInfo, roles, login, logout, DeleteLogout }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContextProvider;
