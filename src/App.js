import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

import LoginContextProvider from './contexts/LoginContextProvider';
import Home from './pages/Home';
import User from './pages/User';
import Login from './pages/Login';
import Join from './pages/Join';
import Post from './pages/Post';
import Admin from './pages/Admin';
import PostForm from './Board/Form/PostForm';
import PostInfo from './components/Post/PostInfo';
import { PostSaveProvider } from './Board/Form/PostSaveProvider';
import { UserListProvider } from './pages/UserListProvider';  
import PostUpdateForm from './components/Role/PostUpdateForm';
import PostCom from './pages/PostCom';
import PostComInfo from './components/PostCom/PostComInfo';
import Post77 from'./pages/post77';
import KakaoMap from "./components/Map/KakaoMap";


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
          <Route path="/postUpdateForm" element={<PostUpdateForm />} />
          <Route path="/postCom" element={<PostCom/>}/>
          <Route path="/postInfo/:postId" element={<PostComInfo />} /> 
          <Route path="/post77" element={<Post77 />} />
          <Route path="/kakao/search" element={<KakaoMap />} />


          {/* 게시글 작성 함수 넘기는 용도 */}
          <Route path="/post-write" element={
            <PostSaveProvider>
              <PostForm />
            </PostSaveProvider>
          } />

          {/* Admin 페이지에서 UserListProvider 적용 */}
          <Route path="/admin" element={
            <UserListProvider>
              <Admin />
            </UserListProvider>
          } />

        </Routes>
      </LoginContextProvider>
    </BrowserRouter>
  );
};

export default App;