import axios from "axios";
import type { Post } from "../types/post";

axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";

export const fetchPosts = async (searchText: string, page: number): Promise<Post[]> => {
  const { data } = await axios.get<Post[]>("/posts", {
    params: {
      q: searchText,
      _page: page,
      _limit: 8,
    },
  });
  return data;
};

export const createPost = async (newPost: Pick<Post, "title" | "body">): Promise<Post> => {
  const { data } = await axios.post<Post>("/posts", newPost);
  return data;
};

export const editPost = async (newDataPost: Pick<Post, "id" | "title" | "body">): Promise<Post> => {
  const { id, title, body } = newDataPost;
  const { data } = await axios.patch<Post>(`/posts/${id}`, { title, body });
  return data;
};

export const deletePost = async (postId: number): Promise<Post> => {
  const { data } = await axios.delete<Post>(`/posts/${postId}`);
  return data;
};
