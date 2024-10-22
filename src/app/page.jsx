import Link from "next/link";
import { Pagination } from "@/components/Pagination";
import { Vote } from "@/components/Vote.jsx";
import { db } from "@/utils/db";
import { POSTS_PER_PAGE } from "@/utils/config";
import { sortPosts, timeSince } from "@/utils/utility";
import QueryButtons from "@/components/QueryButtons";

export default async function Home({ searchParams }) {
  const currentPage = parseInt(searchParams.page || "1", 10);
  const sortBy = searchParams.sortBy || "newest"; // Default sort by newest
  const { rows: posts } = await db.query(
    `SELECT posts.id, posts.title, posts.body, posts.created_at, users.name, 
     COALESCE(SUM(votes.vote), 0) AS vote_total,
     COALESCE(COUNT(votes.vote), 0) AS total_votes,
     COALESCE(SUM(CASE WHEN votes.vote = 1 THEN 1 ELSE 0 END), 0) AS upvotes
     FROM posts
     JOIN users ON posts.user_id = users.id
     LEFT JOIN votes ON votes.post_id = posts.id
     GROUP BY posts.id, users.name
     ORDER BY vote_total DESC
     LIMIT $1
     OFFSET $2`,
    [POSTS_PER_PAGE, POSTS_PER_PAGE * (currentPage - 1)]
  );

  const sortedPosts = sortPosts(posts, sortBy);
  const prefix = "";

  return (
    <>
      <QueryButtons prefix={prefix} />
      <ul className="max-w-screen-lg mx-auto p-4 mb-4">
        {sortedPosts.map((post) => {
          const createdAtDate = new Date(post.created_at);
          const timeDifference = timeSince(createdAtDate);
          return (
            <li
              key={post.id}
              className=" py-4 flex space-x-6 hover:bg-zinc-200 rounded-lg"
            >
              <Vote postId={post.id} votes={post.vote_total} />
              <div>
                <Link
                  href={`/post/${post.id}`}
                  className="text-3xl hover:text-pink-500"
                >
                  {post.title}
                </Link>
                <p className="text-zinc-700">
                  posted by {post.name} | {timeDifference} ago
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <Pagination currentPage={currentPage} />
    </>
  );
}
