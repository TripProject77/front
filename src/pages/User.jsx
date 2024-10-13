import React, { useEffect, useState, useContext } from 'react';
import { LoginContext } from '../contexts/LoginContextProvider'; 
import Header from '../components/Header/Header';
import { UserForm } from '../components/Role/UserForm';
import * as auth from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { FaRegUser } from "react-icons/fa6";

const User = () => {
    const [userInfo, setUserInfo] = useState();

    const { DeleteLogout, isLogin, roles } = useContext(LoginContext);
    const navigate = useNavigate();

    const getUserInfo = async () => {
        if (!isLogin) {
            navigate("/login");
            return;
        }

        try {
            const response = await auth.info();
            const data = response.data;
            console.log('Fetched userInfo:', data);
            setUserInfo(data);
        } catch (error) {
            console.error('Failed to fetch user info:', error);
        }
    };

    const updateUser = async (form) => {
        try {
            const response = await auth.update(form);

            console.log(response.data)

            if (response.status === 200) {
                
                await getUserInfo(); // 수정 후에 다시 최신 정보 로드

                alert('회원 정보 수정 성공 !!');

            } else {
                alert('회원 정보 수정 실패 !!');
            }
        } catch (error) {
            console.error('Failed to update user info:', error);
            alert('회원 정보 수정 중 에러 발생');
        }
    };

    const deleteUser = async (username) => {
        try {
            const check = window.confirm('탈퇴 하시겠습니까 ?');
            if (check) {
                const response = await auth.remove(username);
                if (response.status === 200) {
                    DeleteLogout();
                    alert('회원 정보 삭제 성공 !!');
                } else {
                    alert('회원 정보 삭제 실패 !!');
                }
            } else {
                navigate("/user");
            }
        } catch (error) {
            console.error('Failed to delete user:', error);
            alert('회원 삭제 중 에러 발생');
        }
    };

    useEffect(() => {

        if (isLogin) {
            getUserInfo();
        }
    }, [isLogin, roles]);
    

    return (
        <>
            <Header />
                <div className='container'>
                <h1 style={{ marginBottom: '70px' }}>
                    <FaRegUser style={{ verticalAlign: 'middle', marginRight: '10px' }} />
                    User Information
                </h1>      
                
                <UserForm userInfo={userInfo} updateUser={updateUser} deleteUser={deleteUser} ></UserForm>
                </div>
        </>
    );
};

export default User;
