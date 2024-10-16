import React from "react";
import Header from "../components/Header/Header";

const About = () => {
  return (
    <>
      <Header />
      <div className="containerAbout">
        <h1>About, 소개 페이지 !</h1>
        <hr />
        <p>- 회원가입 하여 게시판을 작성하고 여러 사용자와 소통해보아요</p>
        <p>- 회원을 삭제하면 해당 회원의 게시글, 댓글도 같이 삭제 </p>
        <p>- 게시글을 삭제하면 해당 게시글의 댓글도 같이 삭제</p>
        <p>
          - 댓글의 수정, 삭제 버튼은 현재 로그인 유저의 게시물일 때만 보이도록
          설정
        </p>
        <p>- 관리자는 다른 모든 사용자의 댓글 삭제 가능</p>

        <p>- 깃허브 테스트 tlqkf...</p>
      </div>
    </>
  );
};

export default About;
