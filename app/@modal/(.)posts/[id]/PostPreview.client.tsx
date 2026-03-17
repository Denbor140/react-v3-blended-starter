'use client';

import css from './PostPreview.module.css';
import Modal from '@/components/Modal/Modal';
import { useParams, useRouter } from 'next/navigation';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchPostById, fetchUserById } from '@/lib/api';
import { Post } from '@/types/post';
import { User } from '@/types/user';
import { useEffect, useState } from 'react';

export default function PostPreviewClient() {
  const [user, setUser] = useState<User | null>(null);
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const {
    data: post,
    isLoading,
    error,
  } = useQuery<Post>({
    queryKey: ['post', id],
    queryFn: () => fetchPostById(Number(id)),
    placeholderData: keepPreviousData,
    enabled: false,
    refetchOnWindowFocus: false,
  });

  // const { data: user } = useQuery<User>({
  //   queryKey: ['user', post?.userId],
  //   queryFn: () => fetchUserById(post!.userId),
  //   enabled: !!post?.userId,
  // });

  useEffect(() => {
    if (!post) return;

    const fn = async () => {
      const userData = await fetchUserById(post.userId);
      setUser(userData);
    };

    fn();
  }, [post]);

  const handleClose = () => {
    router.back();
  };

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !post) return <p>Something went wrong</p>;

  return (
    <Modal onClose={handleClose}>
      <button onClick={handleClose} className={css.backBtn}>
        ← Back
      </button>

      <div className={css.post}>
        <div className={css.wrapper}>
          <div className={css.header}>
            <h2>{post.title}</h2>
          </div>

          <p className={css.content}>{post.body}</p>
        </div>
        {user && <p className={css.user}>{user.name}</p>}
      </div>
    </Modal>
  );
}
