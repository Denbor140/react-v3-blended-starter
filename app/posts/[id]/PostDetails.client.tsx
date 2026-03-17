'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import css from './PostDetails.module.css';
import { useParams, useRouter } from 'next/navigation';
import { fetchPostById, fetchUserById } from '@/lib/api';
import { User } from '@/types/user';
import { Post } from '@/types/post';
import { useEffect, useState } from 'react';

export default function PostDetailsClient() {
  const [user, setUser] = useState<User | null>(null);
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const handleClickBack = () => {
    router.back();
  };

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
    refetchOnMount: false,
  });

  // const { data: user } = useQuery<User>({
  //   queryKey: ['user', data?.userId],
  //   queryFn: () => fetchUserById(data!.userId),
  //   enabled: !!data?.userId,
  // });

  useEffect(() => {
    if (!post) return;

    const fn = async () => {
      const userData = await fetchUserById(post.userId);
      setUser(userData);
    };

    fn();
  }, [post]);

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !post) return <p>Something went wrong</p>;

  return (
    <>
      {post && (
        <main className={css.main}>
          <div className={css.container}>
            <div className={css.item}>
              <button onClick={handleClickBack} className={css.backBtn}>
                ← Back
              </button>
              (
              <div className={css.post}>
                <div className={css.wrapper}>
                  <div className={css.header}>
                    <h2>{post.title}</h2>
                  </div>

                  <p className={css.content}>{post.body}</p>
                </div>
                {user && <p className={css.user}>Author: {user.name}</p>}
              </div>
              )
            </div>
          </div>
        </main>
      )}
    </>
  );
}
