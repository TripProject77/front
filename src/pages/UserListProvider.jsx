import React, { createContext, useContext, useEffect, useState } from 'react';
import * as auth from '../api/auth'; // auth 모듈 추가

// UserListContext 생성
const UserListContext = createContext();

// UserListProvider 컴포넌트
export const UserListProvider = ({ children }) => {
    const [userList, setUserList] = useState([]);

    // 사용자 목록 가져오기
    const getUserList = async () => {
        try {
            const response = await auth.list();
            const data = response.data;
            console.log('Fetched userList:', data);
            setUserList(data);
        } catch (error) {
            console.error('Failed to fetch user list:', error);
        }
    };

    // 사용자 삭제하기
    const deleteUser = async (username) => {
        try {
            const check = window.confirm('회원을 삭제 하시겠습니까 ?');

            if (check) {
                const response = await auth.remove(username);
                
                if (response.status === 200) {
                    setUserList((prevList) => prevList.filter(user => user.username !== username));
                    alert('관리자 권한으로 회원 정보 삭제 성공!');
                } else {
                    alert('관리자 권한으로 회원 정보 삭제 실패!');
                }
            }
        } catch (error) {
            console.error('Failed to delete user:', error);
            alert('회원 삭제 중 에러 발생');
        }
    };

    useEffect(() => {
        if (userList.length === 0) {
            getUserList();
        }
    }, []);
    

    return (
        <UserListContext.Provider value={{ userList, getUserList, deleteUser }}>
            {children}
        </UserListContext.Provider>
    );
};

// 사용자 목록을 사용하는 훅
export const useUserList = () => useContext(UserListContext);