import React, { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom';
import axios from 'axios'; 
import Slider from 'react-slick';
import Header from '../components/Header/Header';
import { useNavigate } from 'react-router-dom';
import "./Home.scss";
import WeatherInfo from '../components/weather/weather';
import { PiBackpackDuotone } from "react-icons/pi";
import { CiCalendar } from "react-icons/ci";
import { LuSubtitles } from "react-icons/lu";

const Home = () => {
    const navigate = useNavigate(); 
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000
    };
    
    const goToPostForm = () => {
        navigate('/post');
    };

    const goToPost77 = () => {
        navigate('/post77');
    };
    
    const [posts, setPosts] = useState([]);  // 게시글 목록

    const getPosts = async () => {
        try {
            const response = await axios.get('/post/postList'); // 전체 게시글 불러오기
            const data = response.data; // 전체 데이터 가져오기
            setPosts(data.slice(0, 3));  // 최대 3개만 저장
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };

    useEffect(() => {
        getPosts();
    }, []);

    return (
        <>
            <Header />
            <div className='container'>
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
                <div className='layout-container'>
                    <div className='home-container'>
                        <h3>최근 동행 게시글</h3><br/>
                        <hr/>
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
                                                    <span><CiCalendar className="icon" /> {post.startDate} ~ {post.endDate}</span>  
                                                </div><br/>

                                                {/* 작성자와 작성 기간 */}
                                                <div className="post-card-details">
                                                    <div>{new Date(post.createdDate).toLocaleDateString()} {post.writer} </div>
                                                </div>
                                                
                                            </div>
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <WeatherInfo className="weather-info" />

                </div>
            </div>
        </>
    );
};


export default Home;
