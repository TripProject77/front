import React, { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import ReactPaginate from "react-paginate";
import { Link, useNavigate } from "react-router-dom";
import * as auth from "../api/auth";
import "./PostCom.css";
import Header from "../components/Header/Header";
import { MdContentPaste } from "react-icons/md";
import { TbPencilCheck } from "react-icons/tb";
import { LuSubtitles } from "react-icons/lu";

// 자유 게시판
const Post = () => {
  const navigate = useNavigate();

  const [postList, setPostList] = useState([]);
  const [userInfo, setUserInfo] = useState();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 12;

  // 각 게시글의 이미지 상태를 관리하기 위한 상태 추가
  const [postImages, setPostImages] = useState({});

  const getPostList = async () => {
    try {
      const response = await auth.postList();
      const data = response.data;

      // postCategory가 "together"인 게시글만 필터링
      const filtered = data.filter((post) => post.postCategory === "free");
      setPostList(filtered);
      setFilteredPosts(filtered);

      // 게시글 목록을 가져온 후 각 게시글의 이미지를 불러옴
      filtered.forEach((post) => {
        fetchPostImage(post.id); // 각 게시글의 이미지를 비동기로 불러옴
      });
    } catch (error) {
      console.error("Failed to fetch post list:", error);
    }
  };

  const getUserInfo = async () => {
    try {
      const response = await auth.info();
      const data = response.data;
      setUserInfo(data);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  // 날짜 형식 변경 함수
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // 검색 관련 함수
  const handleSearch = (e) => {
    e.preventDefault();

    const filtered = postList.filter((post) => {
      const matchesSearchTerm =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearchTerm;
    });

    setFilteredPosts(filtered);
    setCurrentPage(0);
  };

  // url 이동 기능
  const handleClick = () => {
    navigate("/free-post-write");
  };

  const handleCardClick = (postId) => {
    navigate(`/postInfo/${postId}`);
  };

  // 페이징 기능
  const offset = currentPage * postsPerPage;
  const currentPagePosts = filteredPosts.slice(offset, offset + postsPerPage);
  const pageCount = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // 게시글의 이미지를 서버에서 가져오는 함수
  const fetchPostImage = async (postId) => {
    try {
      const response = await auth.getPostImage(postId);
      const imageUrl = response.data.url;
      setPostImages((prevImages) => ({ ...prevImages, [postId]: imageUrl }));
    } catch (error) {
      console.error("Error fetching post image:", error);
    }
  };

  useEffect(() => {
    getPostList();
    getUserInfo();
  }, []);

  return (
    <>
      <Header />
      <div className="container">
        <div className="title-button-container">
          <BsPencilSquare style={{ margin: "15px" }} />
          <h2>자유 게시판</h2>

          <div className="search-and-button-container">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="키워드를 입력하세요"
                className="search-input"
              />
              <button type="submit" className="search-button">
                검색
              </button>
            </form>
            <button onClick={handleClick}>새 글 작성</button>
          </div>
        </div>

        <hr style={{ marginBottom: "50px;" }} />

        <div className="card-container">
          {currentPagePosts.map((post, index) => (
            <div
              key={index}
              className="card"
              onClick={() => handleCardClick(post.id)}
            >
              <div>
                <p>
                  <LuSubtitles className="icon" /> {post.title}
                </p>
                <div className="card-footer">
                  <p>
                    <TbPencilCheck className="icon" /> {post.writer}
                  </p>

                  <div className="right-info">
                    <p>{formatDate(post.createdDate)}</p>
                    <p>조회수: {post.count}</p>
                  </div>
                </div>

                <hr className="postHr"></hr>
              </div>

              <div className="postImage">
                {postImages[post.id] ? (
                  <img
                    src={postImages[post.id]}
                    alt="postImage"
                    className="postImage"
                  />
                ) : (
                  <p>이미지를 불러올 수 없습니다.</p>
                )}
              </div>

              <p className="postContent">
                <MdContentPaste className="icon" />{" "}
                {post.content.length > 100
                  ? post.content.substring(0, 100) + "..."
                  : post.content}
              </p>
            </div>
          ))}
        </div>

        <ReactPaginate
          previousLabel={"이전"}
          nextLabel={"다음"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          previousClassName={"pagination-prev"}
          nextClassName={"pagination-next"}
        />
      </div>
    </>
  );
};

export default Post;
