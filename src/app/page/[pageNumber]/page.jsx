import { PostList } from "@/components/PostList";

export default async function PageNumberRoute({ params, searchParams }) {
  const pageNumber = parseInt(params.pageNumber, 10);
  console.log("Page Number:", pageNumber);
  return (
    <div>
      <PostList
        searchParams={searchParams}
        currentPage={parseInt(params.pageNumber, 10)}
      />
    </div>
  );
}
