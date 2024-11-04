import React, { useEffect, useState, useContext } from "react";
import * as auth from "../../api/auth";
import { LoginContext } from "../../contexts/LoginContextProvider";
import { useNavigate } from "react-router-dom";
import "./UserUpdateForm.css";

const UserUpdateForm = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [userInfo, setUserInfo] = useState();
  const { DeleteLogout, isLogin, roles } = useContext(LoginContext);
  const navigate = useNavigate();

  const onUpdate = (e) => {
    e.preventDefault();
    const form = e.target;
    const username = form.username.value;
    const name = form.name.value;
    const email = form.email.value;
    const gender = form.gender.value;
    const age = form.age.value;
    const selfIntro = form.selfIntro.value;

    updateUser({ username, name, email, gender, age, selfIntro });
  };

  const getUserInfo = async () => {
    if (!isLogin) {
      navigate("/login");
      return;
    }

    try {
      const response = await auth.info();
      const data = response.data;
      console.log("Fetched userInfo:", data);
      setUserInfo(data);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  const updateUser = async (form) => {
    try {
      const response = await auth.update(form);

      console.log(response.data);

      if (response.status === 200) {
        await getUserInfo(); // 수정 후에 다시 최신 정보 로드

        alert("회원 정보 수정 성공 !!");
      } else {
        alert("회원 정보 수정 실패 !!");
      }
    } catch (error) {
      console.error("Failed to update user info:", error);
      alert("회원 정보 수정 중 에러 발생");
    }
  };

  const deleteUser = async (username) => {
    try {
      const check = window.confirm("탈퇴 하시겠습니까 ?");
      if (check) {
        const response = await auth.remove(username);
        if (response.status === 200) {
          DeleteLogout();
          alert("회원 정보 삭제 성공 !!");
        } else {
          alert("회원 정보 삭제 실패 !!");
        }
      } else {
        navigate("/user");
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("회원 삭제 중 에러 발생");
    }
  };

  useEffect(() => {
    if (isLogin) {
      getUserInfo();
    }
  }, [isLogin, roles]);

  useEffect(() => {
    if (userInfo?.username) {
      fetchProfileImage(userInfo.username);
    }
  }, [userInfo]);

  // 날짜 형식 변환 함수
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
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
        formData.append("file", file); // FormData에 파일 추가

        const response = await auth.uploadProfileImage(
          userInfo.username,
          formData
        );

        setProfileImage(`${response.data.url}?t=${new Date().getTime()}`); // URL에 쿼리 파라미터 추가

        console.log("Profile image updated:", response.data.url);
      } catch (error) {
        console.error("Failed to upload profile image:", error);
      }
    }
  };

  return (
    <div className="userUpdateContainer">
      {/* 왼쪽 이미지 영역 */}
      <div className="userProfile">
        {profileImage ? (
          <img src={profileImage} alt="Profile" className="profileImage" />
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
        <h2 className="userInfo-title">[ {userInfo?.name} ] 님의 정보</h2>

        <form className="userInfo-form" onSubmit={onUpdate}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="username"
              name="username"
              autoComplete="username"
              required
              readOnly
              defaultValue={userInfo?.username}
            />
          </div>

          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder="name"
              name="name"
              autoComplete="name"
              required
              defaultValue={userInfo?.name}
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="email"
              name="email"
              autoComplete="email"
              required
              defaultValue={userInfo?.email}
            />
          </div>

          <div>
            <label htmlFor="gender">성별</label>
            <input
              type="text"
              id="gender"
              name="gender"
              list="genderList"
              defaultValue={userInfo?.gender}
              required
            />
            <datalist id="genderList">
              <option value="남자" />
              <option value="여자" />
            </datalist>
          </div>

          <div>
            <label htmlFor="age">나이</label>
            <input
              type="text"
              id="age"
              name="age"
              list="ageList"
              defaultValue={userInfo?.age}
              required
            />
            <datalist id="ageList">
              <option value="20대" />
              <option value="30대" />
              <option value="40대" />
              <option value="50대" />
              <option value="60대" />
            </datalist>
          </div>

          <div>
            <label htmlFor="selfIntro">자기소개</label>
            <input
              type="text"
              id="selfIntro"
              name="selfIntro"
              required
              defaultValue={userInfo?.selfIntro}
            />
          </div>

          <div>
            <label htmlFor="role">
              등급 : {userInfo?.role === "ROLE_USER" ? "일반 사용자" : "관리자"}
            </label>
          </div>

          <div>
            <label htmlFor="createdDate">
              가입 날짜 : {formatDate(userInfo?.createdDate)}
            </label>
          </div>

          <button type="submit" className="userInfoBtn--form">
            정보 수정
          </button>
          <button
            type="button"
            className="userInfoBtn--form"
            onClick={() => deleteUser(userInfo.username)}
          >
            회원 탈퇴
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserUpdateForm;
