import React, { useEffect, useState } from 'react';
import { BsPencilSquare } from "react-icons/bs";
import ReactPaginate from 'react-paginate'; // 페이징 라이브러리 추가
import { Link, useNavigate } from 'react-router-dom';
import * as auth from '../api/auth';
import '../App.css';
import Header from '../components/Header/Header';

const Post = () => {

    const navigate = useNavigate(); 

    const [postList, setPostList] = useState([]); 
    const [userInfo, setUserInfo] = useState();

    const [searchTerm, setSearchTerm] = useState(''); 
    const [filteredPosts, setFilteredPosts] = useState([]);

    const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태
    const postsPerPage = 8; // 한 페이지 게시글 수

    const getPostList = async () => {
        try {
            const response = await auth.postList();  
            const data = response.data;
            console.log('Fetched postList:', data);
            setPostList(data);  
            setFilteredPosts(data); 
        } catch (error) {
            console.error('Failed to fetch post list:', error);
        }
    };

    // 유저 정보
    const getUserInfo = async () => {
        try {
            const response = await auth.info();
            const data = response.data;
            console.log('Fetched userInfo:', data);
            setUserInfo(data);
        } catch (error) {
            console.error('Failed to fetch user info:', error);
        }
    };

    // 날짜 표시 
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    useEffect(() => {
        getPostList();  
        getUserInfo();
    }, []);

    // 검색 기능 구현
    const handleSearch = (e) => {
        e.preventDefault();

        const filtered = postList.filter(post => 
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setFilteredPosts(filtered);
        setCurrentPage(0); 
    };

    const handleClick = () => {
        navigate("/post-write");
    };

    // 현재 페이지에 맞는 게시물 계산
    const offset = currentPage * postsPerPage;
    const currentPagePosts = filteredPosts.slice(offset, offset + postsPerPage);
    const pageCount = Math.ceil(filteredPosts.length / postsPerPage); // 전체 페이지 수 계산

    // 페이지 전환 시 호출되는 함수
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <>
            <Header />
            <div className='container'>
                <div className='title-button-container'>
                    
                    <BsPencilSquare style={{ margin: '15px' }} />  
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

                            <button type="submit" className="search-button" >
                                검색
                            </button>
                        </form>
        
                        <button onClick={handleClick}>
                            새 글 작성
                        </button>
                    </div>
                </div>

                <hr/>
                
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th align='center'>번호</th>
                                <th align='center'>제목</th>
                                <th align='center'>내용</th>
                                <th align='center'>작성자</th>
                                <th align='center' style={{ padding: '30px' }}>생성일</th>
                                <th align='center'>조회수</th>
                            </tr>
                        </thead>
    
                        <tbody>
                            {currentPagePosts.map((post, index) => (
                                <tr key={index}>
                                    <td align='center' style={{ padding: '30px 0' }}>{post.id}</td>

                                    <td align='center' className="table-cell">
                                        <Link to={`/postInfo/${post.id}`}>{post.title}</Link> 
                                    </td>

                                    <td align='center' style={{ padding: '30px 0' }}>
                                        {post.content.split('\n').flatMap((line) => {
                                            // 각 줄을 68자씩 나누어 배열로 변환
                                            const segments = [];
                                            for (let i = 0; i < line.length; i += 68) {
                                                segments.push(line.slice(i, i + 68)); // 68자씩 잘라서 배열에 추가
                                            }
                                            return segments.map((segment, segIndex) => (
                                                <span key={segIndex}>
                                                    {segment}<br /> 
                                                </span>
                                            ));
                                        })}
                                    </td>
                                    <td align='center' style={{ padding: '30px 0' }}>{post.writer}</td>
                                    <td align='center' style={{ padding: '30px 0' }}>{formatDate(post.createdDate)}</td>
                                    <td align='center' style={{ padding: '30px 0' }}>{post.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 페이징 컴포넌트 추가 */}
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
