import React, { useState } from "react";
import "./JoinForm.css";

const JoinForm = ({ join }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("프로필 이미지를 선택해주세요");

  const onJoin = (e) => {
    e.preventDefault(); // submit 기본 동작 방지

    const form = e.target;
    const formData = new FormData();

    const username = form.username.value.trim();
    const password = form.password.value.trim();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const gender = form.gender.value.trim();
    const age = form.age.value.trim();

    const user = {
      username: username,
      password: password,
      name: name,
      email: email,
      gender : gender,
      age : age
    };

    formData.append(
      "user",
      new Blob([JSON.stringify(user)], { type: "application/json" })
    );

    // 선택된 이미지 파일 추가
    if (file) {
      formData.append("file", file);
    }

    join(formData);
  };

  // 파일 선택 시 호출되는 핸들러
  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  return (
    <div className="join_container">
      <h2 className="join-title">회원가입</h2>

      <form className="join-form" onSubmit={(e) => onJoin(e)}>
        <div>
          <label htmlFor="username">아이디</label>
          <input
            type="text"
            id="username"
            placeholder="username"
            name="username"
            autoComplete="username"
            required
          />
        </div>

        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            placeholder="password"
            name="password"
            autoComplete="password"
            required
          />
        </div>

        <div>
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            placeholder="name"
            name="name"
            autoComplete="name"
            required
          />
        </div>

        <div>
          <label htmlFor="gender">성별</label>
          <input
            type="text"
            id="gender"
            name="gender"
            placeholder="gender"
            list="genderList"
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
            placeholder="age"
            list="ageList"
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
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            placeholder="email"
            name="email"
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label htmlFor="email" style={{ marginTop: "5px" }}>
            프로필 이미지
          </label>

          <input
            type="file"
            id="file"
            name="file"
            accept="image/*"
            onChange={onFileChange}
            style={{ display: "none" }}
          />
          <label htmlFor="file" className="btn-join">
            {fileName}
          </label>
        </div>

        <button
          className="btn-join"
          style={{ marginTop: "10px" }} >
          가입
        </button>
      </form>
    </div>
  );
};

export default JoinForm;
