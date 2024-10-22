import Link from "next/link";
import { Vote } from "@/components/Vote";
import { Pagination } from "@/components/Pagination";
import { db } from "@/utils/db";
import { POSTS_PER_PAGE } from "@/utils/config";
import { sortPosts, timeSince } from "@/utils/utility";
import QueryButtons from "@/components/QueryButtons";

export function generateMetadata({ params }) {
  const { username } = params;
  const fUsername = username.replace(/-/g, " ");
  return {
    title: `${fUsername}'s Profile`,
    description: `See all posts from ${fUsername} | Didit`,
  };
}

export default async function UserPage({ params, searchParams }) {
  const { username } = params;
  const fUsername = username.replace(/-/g, " ");
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
    WHERE users.name = $1
    GROUP BY posts.id, users.name
    ORDER BY vote_total DESC
    LIMIT $2 OFFSET $3`,
    [fUsername, POSTS_PER_PAGE, POSTS_PER_PAGE * (currentPage - 1)]
  );

  if (posts.length === 0) {
    return <p>404 | No posts found for {fUsername}</p>;
  }

  const sortedPosts = sortPosts(posts, sortBy);
  const prefix = `/u/${username}`;

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <h1 className="text-4xl mb-6">{fUsername}&#39;s Posts</h1>
      <QueryButtons prefix={prefix} />
      <ul className="mb-4">
        {posts.length > 0 ? (
          sortedPosts.map((post) => {
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
