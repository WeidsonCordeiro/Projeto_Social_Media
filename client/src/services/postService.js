// Utils
import { requestConfig } from "../../utils/config";

const handleResponse = async (res) => {
  const result = await res.json();

  if (!res.ok) {
    throw new Error(result?.errors || "Request error");
  }

  return result;
};

const fetchWithConfig = async (url, config) => {
  try {
    const res = await fetch(url, config);
    return await handleResponse(res);
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

// LIKE
export const likePost = async (postId, userId, token) => {
  const config = requestConfig("PUT", { userId }, token);

  return fetchWithConfig(`/api/posts/likes/${postId}`, config);
};

// CREATE COMMENT
export const addPost = async (postId, userId, commentText, token) => {
  const config = requestConfig("PUT", { userId, comments: commentText }, token);

  return fetchWithConfig(`/api/posts/comment/${postId}`, config);
};

// UPDATE POST
export const updatePost = async (postId, userId, description, token) => {
  const config = requestConfig("PUT", { userId, description }, token);

  return fetchWithConfig(`/api/posts/${postId}`, config);
};

// DELETE POST
export const deletePost = async (postId, token) => {
  const config = requestConfig("DELETE", null, token);

  return fetchWithConfig(`/api/posts/${postId}`, config);
};

// DELETE COMMENT
export const deleteComment = async (postId, commentId, token) => {
  const config = requestConfig("DELETE", null, token);

  return fetchWithConfig(`/api/posts/${postId}/comments/${commentId}`, config);
};

// UPDATE COMMENT
export const updateComment = async (postId, commentId, description, token) => {
  const config = requestConfig("PUT", { text: description }, token);

  return fetchWithConfig(`/api/posts/${postId}/comments/${commentId}`, config);
};
