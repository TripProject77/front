import React from "react";
import Header from "../components/Header/Header";
import LoginContextConsumer from "../contexts/LoginContextConsumer";
import LoginForm from "../components/Login/LoginForm";

const Login = () => {
  return (
    <>
      <Header />
      <div className="container">
        <LoginForm />
      </div>
    </>
  );
};

export default Login;
