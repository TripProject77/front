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

// 팔로우
export const follow = (name) => api.post(`/user/${name}/follow`)

// 팔로우 취소
export const followCancel = (name) => api.delete(`/user/${name}/delete/follow`)

// ------------ 게시물 -------------

// 게시물 저장
export const postSave = (data) => api.post(`post/write`, data);

// 자유 게시물 수정
export const updateFreePost = (postId, data) => api.post(`/post/free/update/${postId}`, data) // json 형식

// 동행 게시글 수정
export const updatePost = (postId, data) => api.post(`/post/update/${postId}`, data) // json 형식

// 게시물 삭제
export const removePost = (id) => api.delete(`/post/delete/${id}`)

// 게시물 상세
export const postInfo = (id) => api.get(`/post/info/${id}`);

// 게시물 리스트
export const postList = () => api.get("/post/postList");

// 게시글 작성자 정보
export const postWriterInfo = (name) => api.get(`/user/postWriterInfo/${name}`)

// 게시글 업데이트 상태
export const postUpdateStatus = (id) => api.post(`/post/update/${id}/status`);

// 동행 참여
export const participate = (postId) => api.post(`/post/${postId}/participate`)

// 동행 참여 취소
export const participateCancel = (id) => api.delete(`/post/delete/participate/${id}`)

// ------------ 댓글 -------------

// 댓글 작성
export const addComment = (postId, data) => api.post(`/comment/${postId}/write`, data); 

// 댓글 수정
export const updateComment = (commentId, data) => api.post(`/comment/${commentId}/update`, data);

// 댓글 삭제
export const removeComment = (id) => api.delete(`/comment/delete/${id}`)

// 댓글 리스트
export const CommentList = (id) => api.get(`/comment/commentList/${id}`);

export const uploadImage = () => api.get(`/file/upload`)

export const getImage = (username) => api.get(`/file/${username}/image`);

export const getPostImage = (postId) => api.get(`/file/${postId}/postImage`);

export const uploadProfileImage = (username, data) => api.post(`/file/uploadProfileImage/${username}`, data);

// ------------ 쪽지 -------------

export const messageWrite = (data) => api.post(`/message/writeMessage`, data)

export const sendedMessage = () => api.get(`/message/sendMessage`);

export const receiveMessage = () => api.get(`/message/receiveMessage`);


export const deleteReceiveMessage = (messageId) => api.delete(`/message/received/delete/${messageId}`)

export const deleteSendMessage = (messageId) => api.delete(`/message/sended/delete/${messageId}`)
