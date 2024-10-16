import React, { useContext } from "react";
import { LoginContext } from "./LoginContextProvider";

const LoginContextConsumer = ({ children }) => {
  const { isLogin } = useContext(LoginContext);

  return (
    <div>
      <h3>로그인 여부: {isLogin ? "로그인 상태" : "로그아웃 상태"}</h3>
      {children}
    </div>
  );
};

export default LoginContextConsumer;
