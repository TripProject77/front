import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as auth from "../api/auth";
import Header from "../components/Header/Header";
import { useNavigate } from "react-router-dom";
import "./Home.scss";
import WeatherInfo from "../components/weather/weather";
import { CiCalendar } from "react-icons/ci";
import { LuSubtitles } from "react-icons/lu";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { LoginContext } from "../contexts/LoginContextProvider";

const Home = () => {
  const navigate = useNavigate();

  const [domesticDestinations, setDomesticDestinations] = useState([]);
  const [internationalDestinations, setInternationalDestinations] = useState(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isLogin, userInfo, logout } = useContext(LoginContext);
  const [homeProfileImage, setHomeProfileImage] = useState(null);

  console.log(isLogin);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const goToPostForm = () => {
    navigate("/post");
  };

  const [posts, setPosts] = useState([]); // 게시글 목록

  const getPosts = async () => {
    try {
      const response = await axios.get("/post/postList"); // 전체 게시글 불러오기
      const data = response.data; // 전체 데이터 가져오기
      setPosts(data.slice(0, 3)); // 최대 3개만 저장
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  // 국내 여행지 데이터를 가져오는 함수
  const fetchDomesticDestinations = () => {
    setLoading(true);
    setError(null);

    axios
      .get("/api/travel/top10/domestic")
      .then((response) => {
        setDomesticDestinations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching domestic travel destinations:", error);
        setError("국내 여행지 정보를 가져오는 중 오류가 발생했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 해외 여행지 데이터를 가져오는 함수
  const fetchInternationalDestinations = () => {
    setLoading(true);
    setError(null);

    axios
      .get("/api/travel/top10/international")
      .then((response) => {
        setInternationalDestinations(response.data);
      })
      .catch((error) => {
        console.error(
          "Error fetching international travel destinations:",
          error
        );
        setError("해외 여행지 정보를 가져오는 중 오류가 발생했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 사용자 이미지 불러오기
  const fetchHomeProfileImage = async (username) => {
    try {
      const response = await auth.getImage(username);
      const data = response.data;
      console.log("Fetched image URL:", data.url);
      setHomeProfileImage(data.url);
    } catch (error) {
      console.error("Error fetching profile image:", error);
    }
  };

  // useEffect를 사용해 컴포넌트가 렌더링될 때 데이터를 가져옵니다.
  useEffect(() => {
    fetchDomesticDestinations(); // 국내 여행지 데이터 가져오기
    fetchInternationalDestinations(); // 해외 여행지 데이터 가져오기
  }, []);

  useEffect(() => {
    if (userInfo?.username) {
      fetchHomeProfileImage(userInfo.username);
    }
  }, [userInfo]);

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      <Header />
      <div className="container">
        <div className="home-wrapper">
          <div className="home-title">
            <span>가보자Go</span>에 오신걸 환영합니다
          </div>
          <div className="home-contents">
            동행을 구해 함께 여행을 떠나보세요 !
          </div>

          <button className="write-post-btn" onClick={goToPostForm}>
            가보자Go
          </button>
        </div>
        <div className="layout-container">
          <div className="home-container">
            <h3>최근 동행 게시글</h3>
            <br />
            <hr />
            <div className="post-card-container">
              {posts.length === 0 ? (
                <div>게시글이 없습니다.</div>
              ) : (
                posts.map((post) => (
                  <div className="post-card" key={post.id}>
                    <Link to={`/postInfo/${post.id}`}>
                      <div className="post-card-content">
                        {/* 제목 */}
                        <div className="post-card-title">
                          <LuSubtitles className="icon" /> {post.title}
                        </div>

                        {/* 기간 */}
                        <div className="post-card-period">
                          <span>
                            <CiCalendar className="icon" /> {post.startDate} ~{" "}
                            {post.endDate}
                          </span>
                        </div>
                        <br />

                        {/* 작성자와 작성 기간 */}
                        <div className="post-card-details">
                          <div>
                            {new Date(post.createdDate).toLocaleDateString()}{" "}
                            {post.writer}{" "}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="home-login-form">
            {isLogin ? (
              <div className="login-wrapper">
                <div className="info">
                  <div className="Profile">
                    {homeProfileImage ? (
                      <img
                        src={homeProfileImage}
                        alt="Profile"
                        className="HomeProfileImage"
                      />
                    ) : (
                      <p>프로필 이미지를 불러올 수 없습니다.</p>
                    )}
                  </div>
                  <div className="userInfo">
                    <p className="username">{userInfo.username}</p>
                    <p className="email">{userInfo.email}</p>
                  </div>
                </div>
                <button className="logout-button" onClick={() => logout()}>
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="non-login-wrapper">
                <p className="info-text">
                  가보자GO의 기능을 편리하게 이용해보세요
                </p>
                <Link to="/login">
                  <button className="login">가보자GO 로그인</button>
                </Link>
                <p className="signup-text">
                  아직 회원이 아니신가요? <a href="/join">회원가입</a>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="home-container2">
          <div className="place-container">
            {/* 국내 여행지 */}
            <div className="top10">
              <h3>국내 인기 여행지 TOP 10</h3>
              <hr />
              <ul>
                {domesticDestinations.map((destination, index) => (
                  <li key={index}>
                    <p>
                      <HiOutlineLocationMarker /> {destination.searchWord} -{" "}
                      {destination.areaOrCountryName}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* 해외 여행지 */}
            <div className="top10">
              <h3>해외 인기 여행지 TOP 10</h3>
              <hr />
              <ul>
                {internationalDestinations.map((destination, index) => (
                  <li key={index}>
                    <p>
                      <HiOutlineLocationMarker /> {destination.searchWord} -{" "}
                      {destination.areaOrCountryName}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="weather">
            <WeatherInfo className="weather-info" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
