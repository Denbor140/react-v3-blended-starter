import { fetchPosts } from '@/lib/api';
import PostsClient from './Posts.client';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

interface PostsPageProps {
  params: Promise<{ id: string[] }>;
}

export default async function PostsPage({ params }: PostsPageProps) {
  const { id: filter } = await params;
  const userId = filter[0];

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['posts', '', 1, userId],
    queryFn: () =>
      fetchPosts({
        searchText: '',
        page: 1,
        ...(userId !== 'All' && { userId }),
      }),
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PostsClient userId={userId} />
      </HydrationBoundary>
    </>
  );
}
