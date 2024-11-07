import React, { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { LuSubtitles } from "react-icons/lu";
import { MdContentPaste } from "react-icons/md";
import { TbPencilCheck } from "react-icons/tb";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import * as auth from "../api/auth";
import Header from "../components/Header/Header";
import "./PostCom.css";

// 자유 게시판
const Post = () => {
  const navigate = useNavigate();

  const [postList, setPostList] = useState([]);
  const [userInfo, setUserInfo] = useState();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 12;

  // 페이징 기능
  const offset = currentPage * postsPerPage;
  const currentPagePosts = filteredPosts.slice(offset, offset + postsPerPage);
  const pageCount = Math.ceil(filteredPosts.length / postsPerPage);

  // 사용자 프로필
  const [ProfileImage, setProfileImage] = useState(null);

  const [postWriterInfo, setPostWriterInfo] = useState();

  const getPostList = async () => {
    try {
      const response = await auth.postList();
      const data = response.data;

      const filtered = data.filter((post) => post.postCategory === "free");
      setPostList(filtered);
      setFilteredPosts(filtered);

      filtered.forEach(async (post) => {
        const writer = post.writer;
        try {
          const writerInfoResponse = await auth.postWriterInfo(writer);
          const writerData = writerInfoResponse.data;

          const profileImageResponse = await auth.getImage(writerData.username);
          const profileImageData = profileImageResponse.data;

          setPostList((prevPosts) =>
            prevPosts.map((p) =>
              p.writer === writer
                ? {
                    ...p,
                    writerInfo: writerData,
                    profileImage: profileImageData.url,
                  }
                : p
            )
          );
        } catch (error) {
          console.error(
            "게시글 프로필 이미지를 불러올 수 없습니다.:",
            error
          );
        }
      });
    } catch (error) {
      console.error("게시글 리스트를 불러올 수 없습니다.", error);
    }
  };

  const getPostWriterInfo = async (name) => {
    try {
      const response = await auth.postWriterInfo(name);
      const data = response.data;
      console.log(data);
      setPostWriterInfo(data);
    } catch (error) {
      console.error("게시글 작성자 정보를 불러올 수 없습니다.:", error);
    }
  };

  const fetchProfileImage = async (username) => {
    try {
      const response = await auth.getImage(username);
      const data = response.data;
      setProfileImage(data.url);
    } catch (error) {
      console.error(
        "로그인 사용자 프로필 이미지를 불러올 수 없습니다.:",
        error
      );
    }
  };

  const getUserInfo = async () => {
    try {
      const response = await auth.info();
      const data = response.data;
      setUserInfo(data);
    } catch (error) {
      console.error("로그인 된 사용자 정보를 불러올 수 없습니다.", error);
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

  // 검색 함수
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

  const handleClick = () => {
    navigate("/free-post-write");
  };

  const handleCardClick = (postId) => {
    navigate(`/postInfo/${postId}`);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  useEffect(() => {
    getPostList();
    getUserInfo();
    getPostWriterInfo();
  }, []);

  useEffect(() => {}, []);

  useEffect(() => {
    if (postWriterInfo) {
      if (postWriterInfo?.username) {
        fetchProfileImage(postWriterInfo.username);
      }
    }
  }, [postWriterInfo]);

  useEffect(() => {
    if (postWriterInfo) {
      getPostWriterInfo(postWriterInfo);
    }
  }, [postWriterInfo]);

  return (
    <>
      <Header />
      <div className="container">
        <div className="title-button-container">
          <BsPencilSquare style={{ margin: "0px 20px 30px 0px" }} />
          <h2 style={{ marginBottom: "30px" }}>자유 게시판</h2>

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
          {postList.map((post) => (
            <div
              className="card"
              key={post.id}
              onClick={() => handleCardClick(post.id)}
            >
              <div className="writerImage">
                {post.profileImage ? (
                  <img
                    src={post.profileImage}
                    alt={`${post.writer}'s Profile`}
                    className="freePostProfileImage"
                  />
                ) : (
                  <p>No Image</p>
                )}
                <span style={{ marginLeft: "5px" }}>
                  <p style={{ marginTop: "5px", marginBottom: "0px" }}>
                    {post.writer}
                  </p>
                  <p style={{ fontSize: "12px", color: "gray" }}>
                    {formatDate(post.createdDate)}
                  </p>
                </span>
              </div>

              <div className="postContent">
                <div className="postTitle">
                  <p>
                    <LuSubtitles className="icon" /> {post.title}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "gray",
                      marginLeft: "auto",
                    }}
                  >
                    조회수: {post.count}
                  </p>
                </div>
                <div className="postBody">
                  {post.content.length > 140
                    ? post.content.substring(0, 140) + "..."
                    : post.content}
                </div>
              </div>
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
