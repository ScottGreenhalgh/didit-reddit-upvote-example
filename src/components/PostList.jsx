import Link from "next/link";
import { Pagination } from "./Pagination";
import { Vote } from "./Vote";
import { db } from "@/utils/db";
import { POSTS_PER_PAGE as DEFAULT_POSTS_PER_PAGE } from "@//utils/config";
import { sortPosts, timeSince } from "@/utils/utility";
import QueryButtons from "@/components/QueryButtons";

export async function PostList({ currentPage, searchParams }) {
  const sortBy = searchParams.sortBy || "newest"; // Default sort by newest
  const userPostsPerPage =
    parseInt(searchParams.postsPerPage, 10) || DEFAULT_POSTS_PER_PAGE;

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
    [userPostsPerPage, userPostsPerPage * (currentPage - 1)]
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
                  Posted by{" "}
                  <Link
                    className="hover:text-pink-500"
                    href={`/u/${post.name.replace(/ /g, "-")}`}
                  >
                    {post.name}
                  </Link>{" "}
                  | {timeDifference} ago
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
