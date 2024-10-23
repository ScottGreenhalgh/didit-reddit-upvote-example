import Link from "next/link";
import { Vote } from "@/components/Vote";
import { Pagination } from "@/components/Pagination";
import { db } from "@/utils/db";
import { POSTS_PER_PAGE } from "@/utils/config";
import { formatVotes, sortPosts, timeSince } from "@/utils/utility";
import QueryButtons from "@/components/QueryButtons";
import Image from "next/image";

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

  const profile = await db.query(
    `SELECT image, id FROM users WHERE name = $1`,
    [fUsername]
  );

  if (profile.rowCount > 0) {
    const defaultImg = `/template.jpeg`;
    const pfpImg = profile.rows[0].image || defaultImg;
    const userId = `#${profile.rows[0].id}`;

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

    const karma = await db.query(
      `
    WITH user_data AS (
      SELECT id AS user_id 
      FROM users 
      WHERE name = $1
    ),
    user_posts AS (
      SELECT id AS post_id 
      FROM posts 
      WHERE user_id = (SELECT user_id FROM user_data)
    ),
    user_votes AS (
      SELECT vote
      FROM votes 
      WHERE post_id IN (SELECT post_id FROM user_posts)
    )
    SELECT 
      COALESCE(SUM(CASE WHEN vote = 1 THEN 1 ELSE 0 END), 0) AS total_upvotes,
      COALESCE(SUM(CASE WHEN vote = -1 THEN 1 ELSE 0 END), 0) AS total_downvotes,
      COALESCE(SUM(vote), 0) AS vote_difference
    FROM user_votes;
  `,
      [fUsername]
    );

    console.log(karma.rows[0]);

    // Fetch votes from the query
    const { total_upvotes, total_downvotes, vote_difference } = karma.rows[0];

    const sortedPosts = sortPosts(posts, sortBy);
    const prefix = `/u/${username}`;

    return (
      <div className="max-w-screen-lg mx-auto p-4">
        {/* profile heading */}
        <div className=" flex gap-4 items-baseline">
          <Image
            src={pfpImg}
            alt={fUsername}
            width={50}
            height={50}
            className="rounded-full"
            style={{ width: "auto", height: "auto" }}
          />
          <h1 className="text-4xl mb-6 font-bold">{fUsername}</h1>
          <p>{userId}</p>
        </div>
        <div>
          {/* upvotes downvotes (karma) */}
          <h1 className="underline">Karma</h1>
          <ul>
            <li>Total Upvotes: {formatVotes(total_upvotes)}</li>
            <li>Total Downvotes: {formatVotes(total_downvotes)}</li>
            <li>Karama Score: {formatVotes(vote_difference)}</li>
          </ul>
        </div>
        <br />
        <h3 className="text-2xl mb-6 underline">Posts</h3>
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
  } else {
    return (
      <div className="flex text-4xl items-center justify-center h-screen">
        <p className="text-4xl">404 | User not found</p>
      </div>
    );
  }
}
