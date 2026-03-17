import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchPostById } from '@/lib/api';
import PostPreviewClient from './PostPreview.client';

interface PostPreviewProps {
  params: Promise<{ id: string }>;
}

export default async function PostPreview({ params }: PostPreviewProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPostById(Number(id)),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostPreviewClient />
    </HydrationBoundary>
  );
}
