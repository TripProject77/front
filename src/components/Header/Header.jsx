import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { LoginContext } from "../../contexts/LoginContextProvider";

const Header = () => {
  const { isLogin, userInfo, logout } = useContext(LoginContext);

  // 드롭다운 상태 관리
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 드롭다운 토글 함수
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header>
      <div className="logo">
        <Link to="/">
          <span className="logo-text">가보자GO</span>
        </Link>
      </div>
      <div className="util">
        <ul>
          {!isLogin ? (
            <>
              <li className="dropdown">
                <button className="dropbtn" onClick={toggleDropdown}>
                  게시판
                </button>
                {dropdownOpen && (
                  <div className="dropdown-content">
                    <Link to="/postCom">자유 게시판</Link>
                    <Link to="/post">동행 게시판</Link>
                  </div>
                )}
              </li>
              <li>
                <Link to="/admin">관리자</Link>
              </li>
            </>
          ) : (
            <>
              <li><h5 class="user-text">{userInfo?.name}님 환영합니다</h5></li>


              <li className="dropdown">
                <button className="dropbtn" onClick={toggleDropdown}>
                  게시판
                </button>
                {dropdownOpen && (
                  <div className="dropdown-content">
                    <Link to="/post">동행모집</Link>
                    <Link to="/postCom">자유게시판</Link>
                  </div>
                )}
              </li>
              <li>
                <Link to="/user">마이페이지</Link>
              </li>
              <li style={{ paddingRight: "0px" }}>
                <Link to="/admin">관리자</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
