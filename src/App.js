import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import PostForm from "./Board/Form/PostForm";
import { PostSaveProvider } from "./Board/Form/PostSaveProvider";
import FreePostForm from "./Board/Form/FreePostForm";
import KakaoMap from "./components/Map/KakaoMap";
import PostInfo from "./components/Post/PostInfo";
import PostComInfo from "./components/PostCom/PostComInfo";
import FreePostUpdateForm from "./Board/Form/FreePostUpdateForm";
import PostUpdateForm from "./Board/Form/PostUpdateForm";
import LoginContextProvider from "./contexts/LoginContextProvider";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import Join from "./pages/Join";
import Login from "./pages/Login";
import Post from "./pages/Post";
import PostCom from "./pages/PostCom";
import User from "./pages/User";
import { UserListProvider } from "./pages/UserListProvider";
import UserUpdateForm from "./components/Role/UserUpdateForm";
import Follow from "./components/Role/Follow";


const App = () => {
  return (
    <BrowserRouter>
      <LoginContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/user" element={<User />} />
          <Route path="/post" element={<Post />} />
          <Route path="/postInfo/:id" element={<PostInfo />} />
          <Route path="/FreePostUpdateForm" element={<FreePostUpdateForm />} />
          <Route path="/PostUpdateForm" element={<PostUpdateForm />} />
          <Route path="/postCom" element={<PostCom />} />
          <Route path="/postInfo/:postId" element={<PostComInfo />} />
          <Route path="/kakao/search" element={<KakaoMap />} />
          <Route path="/UserUpdate" element={<UserUpdateForm />} />
          <Route path="/Follow" element={<Follow />} />


          {/* 게시글 작성 함수 넘기는 용도 */}
          <Route
            path="/post-write"
            element={
              <PostSaveProvider>
                <PostForm />
              </PostSaveProvider>
            }
          />

          <Route
            path="/free-post-write"
            element={
              <PostSaveProvider>
                <FreePostForm />
              </PostSaveProvider>
            }
          />

          {/* Admin 페이지에서 UserListProvider 적용 */}
          <Route
            path="/admin"
            element={
              <UserListProvider>
                <Admin />
              </UserListProvider>
            }
          />
        </Routes>
      </LoginContextProvider>
    </BrowserRouter>
  );
};

export default App;
