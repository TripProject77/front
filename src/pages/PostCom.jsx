import React, { useState } from "react";
import Header from "../components/Header/Header";
import { BsPencilSquare } from "react-icons/bs";
import PostComForm from "../components/PostCom/PostComForm";
import '../App.css';

const PostCom = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [existingPosts, setExistingPosts] = useState([]);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStartDate, setSelectedStartDate] = useState('');
    const [selectedEndDate, setSelectedEndDate] = useState('');

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const filteredPosts = existingPosts.filter(post => {
        const matchesTitle = !searchTerm || post.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate =
            (!selectedStartDate || new Date(post.startDate) >= new Date(selectedStartDate)) &&
            (!selectedEndDate || new Date(post.endDate) <= new Date(selectedEndDate));
        return matchesTitle && matchesDate;
    });

    return (
        <>
            <Header />
            <div className='container'>
                <div className='title-button-container'>
                    <BsPencilSquare style={{ margin: '15px' }} />
                    <h2>동행 모집</h2>
                    <button onClick={openModal}>모집하기</button>
                </div>

                {isModalOpen && 
                    <PostComForm 
                        onClose={closeModal} 
                        existingPosts={existingPosts} 
                        setExistingPosts={setExistingPosts} 
                    />
                }

                <div className="search-filters">
                    <input
                        type="text"
                        placeholder="제목 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="date-filters">
                        <input
                            type="date"
                            value={selectedStartDate}
                            onChange={(e) => setSelectedStartDate(e.target.value)}
                        />
                        <span>~</span>
                        <input
                            type="date"
                            value={selectedEndDate}
                            onChange={(e) => setSelectedEndDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="recruit-list">
                    <h2>모집 중인 동행</h2>
                    {filteredPosts.length > 0 ? (
                        <div className="card-container">
                            {filteredPosts.map((post, index) => (
                                <div className="card" key={index}>
                                    <h3>{post.title}</h3>
                                    <p>{post.description}</p>
                                    <p>{post.startDate} ~ {post.endDate}</p>
                                    <p>모집 인원: {post.maxParticipants}명</p>

                                    <div className="post-tags">
                                        {post.tags.map((tag, idx) => (
                                            <div className="tag-item" key={idx}>
                                                {tag}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>모집 중인 동행이 없습니다.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default PostCom;