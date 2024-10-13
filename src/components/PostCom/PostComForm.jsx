import React, { useState } from 'react';
import './PostComForm.scss';

const PostComForm = ({ onClose, existingPosts, setExistingPosts }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [maxParticipants, setMaxParticipants] = useState(1);
    const [tags, setTags] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newPost = {
            title,
            description,
            startDate,
            endDate,
            maxParticipants,
            tags, // 해시태그 포함
        };
        
        // Add new post to the existing posts
        setExistingPosts((prevPosts) => [...prevPosts, newPost]);

        // Reset the form fields
        setTitle('');
        setDescription('');
        setStartDate('');
        setEndDate('');
        setMaxParticipants(1);
        setTags([]); // 해시태그 리셋

        onClose(); // Close the modal after submission
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // 엔터 키로 인한 폼 제출 방지
            const value = e.target.value;
            if (!value.trim()) return;
            setTags([...tags, value.trim()]); // 해시태그 추가
            e.target.value = ""; // 입력 필드 초기화
        }
    };

    const removeTag = (index) => {
        setTags(tags.filter((_, idx) => idx !== index)); // 해당 해시태그 삭제
    };

    return (
        <div className="companion-recruitment">
            <h1>동행 모집</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>여행 제목</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                        placeholder="여행 제목을 입력하세요." 
                    />
                </div>

                <div className="form-group">
                    <label>여행 일정</label>
                    <div className="date-inputs">
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)} 
                            required 
                        />
                        <span>~</span>
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)} 
                            required 
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>모집 인원 (최대)</label>
                    <input 
                        type="number" 
                        min="1" 
                        value={maxParticipants} 
                        onChange={(e) => setMaxParticipants(e.target.value)} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>여행 설명</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        rows="5" 
                        placeholder="여행에 대한 설명을 적어주세요."
                    />
                </div>
                <div className="form-group">
                    <div className="tag-input-container">
                        {tags.map((tag, idx) => (
                            <div className="tag-item" key={idx}>
                                <span>{tag}</span>
                                <span onClick={() => removeTag(idx)}>&times;</span>
                            </div>
                        ))}
                        <input
                            className="tag-input"
                            onKeyDown={handleKeyDown}
                            placeholder={tags.length === 0 ? "엔터를 입력하여 관심사를 등록해주세요" : ""}
                        />
                    </div>
                </div>

                <button type="submit" className="submit-btn">모집 등록</button>
                <button type="button" className="cancel-btn" onClick={onClose}>취소</button>
            </form>
        </div>
    );
};

export default PostComForm;