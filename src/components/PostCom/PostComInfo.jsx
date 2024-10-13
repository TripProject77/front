// src/pages/PostDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PostComInfo = () => {
    const { postId } = useParams(); // URL에서 postId를 추출
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                const response = await axios.get(`/post/info/${postId}`); // postId로 해당 글의 정보 요청
                setPost(response.data);
            } catch (error) {
                console.error('Error fetching post detail:', error);
            }
        };

        fetchPostDetail();
    }, [postId]);

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div className="post-detail-container">
            <h1>{post.title}</h1>
            <div>작성자: {post.writer}</div>
            <div>작성일: {new Date(post.createdDate).toLocaleDateString()}</div>
            <div>모집 인원: {post.maxParticipants}명</div>
            <div>여행 일정: {post.startDate} ~ {post.endDate}</div>
            <div>여행 설명:</div>
            <p>{post.description}</p>
            <div>
                <h3>해시태그</h3>
                <ul>
                    {post.tags.map((tag, index) => (
                        <li key={index}>{tag}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PostComInfo;