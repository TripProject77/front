import React, { useState } from "react";
import "./JoinForm.css";

const JoinForm = ({ join }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Choose a file");

  const onJoin = (e) => {
    e.preventDefault(); // submit 기본 동작 방지

    const form = e.target;
    const formData = new FormData();

    const username = form.username.value.trim();
    const password = form.password.value.trim();
    const name = form.name.value.trim();
    const email = form.email.value.trim();

    const user = {
      username: username,
      password: password,
      name: name,
      email: email,
    };

    formData.append(
      "user",
      new Blob([JSON.stringify(user)], { type: "application/json" })
    );

    // 선택된 이미지 파일 추가
    if (file) {
      formData.append("file", file);
    }

    console.log(username, password, name, email, file);

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
    <div className="form">
      <h2 className="join-title">Join</h2>

      <form className="join-form" onSubmit={(e) => onJoin(e)}>
        <div>
          <label htmlFor="username">Username</label>
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
          <label htmlFor="password">Password</label>
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
          <label htmlFor="name">Name</label>
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
          <label htmlFor="email">Email</label>
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
            ProfileImage
          </label>

          <input
            type="file"
            id="file"
            name="file"
            accept="image/*"
            onChange={onFileChange}
            style={{ display: "none" }}
          />
          <label htmlFor="file" className="file-input-label btn btn--form">
            {fileName}
          </label>
        </div>

        <button
          className="btn btn--form btn-join"
          style={{ marginTop: "10px" }}
        >
          Join
        </button>
      </form>
    </div>
  );
};

export default JoinForm;
