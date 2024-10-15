import React, { useEffect, useState } from 'react';
import './UserForm.css';
import * as auth from '../../api/auth';

export const UserForm = ({ userInfo, updateUser, deleteUser }) => {

    const [profileImage, setProfileImage] = useState(null);

    // 사용자 정보 업데이트 핸들러
    const onUpdate = (e) => {
        e.preventDefault();
        const form = e.target;
        const username = form.username.value;
        const name = form.name.value;
        const email = form.email.value;

        updateUser({ username, name, email });
    };

    useEffect(() => {
        if (userInfo?.username) {
            fetchProfileImage(userInfo.username);
        }
    }, [userInfo]);

    // 날짜 형식 변환 함수
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // 사용자 이미지 불러오기
    const fetchProfileImage = async (username) => {
        try {
            const response = await auth.getImage(username); 
            const data = response.data;
            console.log("Fetched image URL:", data.url);
            setProfileImage(data.url);
        } catch (error) {
            console.error("Error fetching profile image:", error);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0]; // 선택한 파일 가져오기

        if (file) {
            try {
                const formData = new FormData(); // FormData 객체 생성
                formData.append('file', file); // FormData에 파일 추가

                const response = await auth.uploadProfileImage(userInfo.username, formData);

                setProfileImage(`${response.data.url}?t=${new Date().getTime()}`); // URL에 쿼리 파라미터 추가

                console.log("Profile image updated:", response.data.url);
            } catch (error) {
                console.error("Failed to upload profile image:", error);
            }
        }
    };

    return (
        <div className="userInfoContainer">

            {/* 왼쪽 이미지 영역 */}
            <div className="userProfile">
                {profileImage ? (
                    <img 
                        src={profileImage} 
                        alt="Profile" 
                        className="profileImage" 
                    />
                ) : (
                    <p>프로필 이미지를 불러올 수 없습니다.</p>
                )}
                {/* 이미지 업로드 버튼 */}
                <label htmlFor="uploadInput" className="uploadLabel">
                    프로필 이미지 변경
                </label>
                <input
                    type="file"
                    id="uploadInput"
                    className="uploadInput"
                    onChange={handleFileChange} // 파일 변경 핸들러 추가
                />
            </div>

            {/* 오른쪽 사용자 정보 영역 */}
            <div className="userInfoForm">
                <h2 className="userInfo-title">
                    {userInfo?.name} 님의 정보
                </h2>

                <form className='userInfo-form' onSubmit={onUpdate}>
                    <div>
                        <label htmlFor='username'>Username</label>
                        <input
                            type="text"
                            id='username'
                            placeholder='username'
                            name='username'
                            autoComplete='username'
                            required
                            readOnly
                            defaultValue={userInfo?.username}
                        />
                    </div>

                    <div>
                        <label htmlFor='name'>Name</label>
                        <input
                            type="text"
                            id='name'
                            placeholder='name'
                            name='name'
                            autoComplete='name'
                            required
                            defaultValue={userInfo?.name}
                        />
                    </div>

                    <div>
                        <label htmlFor='email'>Email</label>
                        <input
                            type="email"
                            id='email'
                            placeholder='email'
                            name='email'
                            autoComplete='email'
                            required
                            defaultValue={userInfo?.email}
                        />
                    </div>

                    <div>
                        <label htmlFor='role'>
                            Role : {userInfo?.role === 'ROLE_USER' ? '일반 사용자' : '관리자'}
                        </label>
                    </div>

                    <div>
                        <label htmlFor='createdDate'>
                            가입 날짜 : {formatDate(userInfo?.createdDate)}
                        </label>
                    </div>

                    <button type='submit' className='userInfoBtn userInfoBtn--form'>
                        정보 수정
                    </button>
                    <button
                        type='button'
                        className='userInfoBtn userInfoBtn--form'
                        onClick={() => deleteUser(userInfo.username)}>
                        회원 탈퇴
                    </button>
                </form>
            </div>
        </div>
    );
};
