import Modal from "../Modal/Modal";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import css from "./App.module.css";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../services/postService";
import { useState } from "react";
import { Post } from "../../types/post";
import EditPostForm from "../EditPostForm/EditPostForm";
import PostForm from "../CreatePostForm/CreatePostForm";
import { useDebouncedCallback } from "use-debounce";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatePost, setIsCreatePost] = useState(false);
  const [isEditPost, setIsEditPost] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const { data } = useQuery<Post[]>({
    queryKey: ["posts", searchQuery, currentPage],
    queryFn: () => fetchPosts(searchQuery, currentPage),
    retry: 1,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const debounceSearch = useDebouncedCallback((text: string) => {
    setSearchQuery(text);
    setCurrentPage(1);
  }, 300);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onSearch={debounceSearch} />
        {data && data.length > 1 && (
          <Pagination totalPages={10} currentPage={currentPage} onPageChange={setCurrentPage} />
        )}
        <button
          className={css.button}
          onClick={() => {
            setIsModalOpen(true);
            setIsCreatePost(true);
            setIsEditPost(false);
          }}
        >
          Create post
        </button>
      </header>
      {isModalOpen && (
        <Modal
          onClose={() => {
            setIsModalOpen(false);
            setIsCreatePost(false);
            setIsEditPost(false);
          }}
        >
          {isCreatePost && <PostForm onClose={() => setIsModalOpen(false)} />}
          {isEditPost && selectedPost && (
            <EditPostForm
              initialValues={{
                id: selectedPost.id,
                title: selectedPost.title,
                body: selectedPost.body,
              }}
              onClose={() => {
                setIsModalOpen(false);
                setIsEditPost(false);
                setSelectedPost(null);
              }}
            />
          )}
        </Modal>
      )}
      <PostList
        posts={data ?? []}
        toggleModal={() => setIsModalOpen(true)}
        toggleEditPost={(post: Post) => {
          setSelectedPost(post);
          setIsModalOpen(true);
          setIsEditPost(true);
          setIsCreatePost(false);
        }}
      />
    </div>
  );
}
