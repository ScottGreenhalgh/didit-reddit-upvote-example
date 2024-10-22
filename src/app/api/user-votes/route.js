import db from "@/lib/db";

export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    // The SQL query we discussed
    const result = await db.query(
      `WITH user_data AS (
        SELECT id AS user_id FROM users WHERE name = $1
      ),
      user_posts_comments AS (
        SELECT id AS content_id, 'post' AS content_type FROM posts WHERE user_id = (SELECT user_id FROM user_data)
        UNION ALL
        SELECT id AS content_id, 'comment' AS content_type FROM d_comments WHERE user_id = (SELECT user_id FROM user_data)
      ),
      user_votes AS (
        SELECT v.vote, v.vote_type, v.created_at
        FROM votes v
        JOIN user_posts_comments upc
          ON (v.vote_type = 'post' AND v.post_id = upc.content_id)
          OR (v.vote_type = 'comment' AND v.post_id = upc.content_id)
      )
      SELECT 
        SUM(CASE WHEN vote = 1 THEN 1 ELSE 0 END) AS total_upvotes,
        SUM(CASE WHEN vote = -1 THEN 1 ELSE 0 END) AS total_downvotes,
        SUM(vote) AS vote_difference -- (upvotes - downvotes)
      FROM user_votes;`,
      [username]
    );

    // Fetch results from the query
    const { total_upvotes, total_downvotes, vote_difference } = result.rows[0];

    return res.status(200).json({
      total_upvotes: total_upvotes || 0, // handling instances where nothing is returned
      total_downvotes: total_downvotes || 0,
      vote_difference: vote_difference || 0,
      total_votes: (total_upvotes || 0) + (total_downvotes || 0),
    });
  } catch (error) {
    console.error("Error fetching votes:", error);
    return res.status(500).json({ error: "Failed to fetch votes" });
  }
}
