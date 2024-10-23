import { PostList } from "@/components/PostList";

export default async function Home({ params = {}, searchParams }) {
  const pageNumber = parseInt(params.pageNumber || "1", 10);
  //console.log("Page Number:", pageNumber);

  return (
    <div>
      <PostList searchParams={searchParams} currentPage={pageNumber} />
    </div>
  );
}
