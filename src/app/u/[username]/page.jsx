import Link from "next/link";
import { Vote } from "@/components/Vote";
import { Pagination } from "@/components/Pagination";
import { db } from "@/db";
import { POSTS_PER_PAGE } from "@/config";
import { timeSince } from "@/utils/utility";

export function generateMetadata({ params }) {
  const { username } = params;
  const fUsername = username.replace(/-/g, " ");
  return {
    title: `${fUsername}'s Profile`,
    description: `See all posts from ${fUsername} and a little about them.`,
  };
}

export default async function UserPage({ params, searchParams }) {
  const { username } = params;
  const fUsername = username.replace(/-/g, " ");
  const currentPage = parseInt(searchParams.page || "1", 10);

  const { rows: posts } = await db.query(
    `SELECT posts.id, posts.title, posts.body, posts.created_at, users.name, 
  COALESCE(SUM(votes.vote), 0) AS vote_total
  FROM posts
  JOIN users ON posts.user_id = users.id
  LEFT JOIN votes ON votes.post_id = posts.id
  WHERE users.name = $1
  GROUP BY posts.id, users.name
  ORDER BY vote_total DESC
  LIMIT $2 OFFSET $3`,
    [fUsername, POSTS_PER_PAGE, POSTS_PER_PAGE * (currentPage - 1)]
  );

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <h1 className="text-4xl mb-6">{fUsername}&#39;s Posts</h1>
      <ul className="mb-4">
        {posts.length > 0 ? (
          posts.map((post) => {
            const createdAtDate = new Date(post.created_at);
            const timeDifference = timeSince(createdAtDate);

            return (
              <li
                key={post.id}
                className="py-4 flex space-x-6 hover:bg-zinc-200 rounded-lg"
              >
                <Vote postId={post.id} votes={post.vote_total} />
                <div>
                  <Link
                    href={`/post/${post.id}`}
                    className="text-3xl hover:text-pink-500"
                  >
                    {post.title}
                  </Link>
                  <p className="text-zinc-700">Posted {timeDifference} ago</p>
                </div>
              </li>
            );
          })
        ) : (
          <p>No posts found for {fUsername}</p>
        )}
      </ul>
      <Pagination currentPage={currentPage} />
    </div>
  );
}
