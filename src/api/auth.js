import api from './api'; // api.js 파일에서 만든 api 객체 사용


// ------------ 사용자 -------------

// 로그인
export const login = (username, password) => api.post(`/login?username=${username}&password=${password}`);

// 회원가입
export const join = (data) => api.post(`/user/join`, data);

// 유저 정보 수정
export const update = (data) => api.post(`/user/update`, data) // json 형식

// 유저 정보 삭제
export const remove = (username) => api.delete(`/user/delete/${username}`)

// 유저 정보
export const info = () => api.get(`/user/info`)

// 유저 리스트
export const list = () => api.get("/user/userList");


// ------------ 게시물 -------------

// 게시물 저장
export const postSave = (data) => api.post(`post/write`, data);

// 게시물 수정
export const updatePost = (data) => api.post(`/post/update`, data) // json 형식

// 게시물 삭제
export const removePost = (id) => api.delete(`/post/delete/${id}`)

// 게시물 상세
export const postInfo = (id) => api.get(`/post/info/${id}`);

// 게시물 리스트
export const postList = () => api.get("/post/postList");


// ------------ 댓글 -------------

// 댓글 작성
export const addComment = (postId, data) => api.post(`/comment/${postId}/write`, data); 

// 댓글 수정
export const updateComment = (commentId, data) => api.post(`/comment/${commentId}/update`, data);

// 댓글 삭제
export const removeComment = (id) => api.delete(`/comment/delete/${id}`)

// 댓글 리스트
export const CommentList = (id) => api.get(`/comment/commentList/${id}`);

export const addReplyComment = (id, replyingToCommentId, data) => api.post(`/comment/${id}/reply/${replyingToCommentId}`, data); 


export const uploadImage = () => api.get(`/file/upload`)

export const getImage = (username) => api.get(`/file/${username}/image`);

export const getPostImage = (postId) => api.get(`/file/${postId}/postImage`);


export const uploadProfileImage = (username, data) => api.post(`/file/uploadProfileImage/${username}`, data);
