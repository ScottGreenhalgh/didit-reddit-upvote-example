import { PostList } from "@/components/PostList";

export default async function PageNumberRoute({ params, searchParams }) {
  return (
    <div>
      <PostList
        searchParams={searchParams}
        currentPage={parseInt(params.pageNumber, 10)}
      />
    </div>
  );
}
