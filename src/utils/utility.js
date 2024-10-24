export function timeSince(date) {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval} years`;

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} months`;

  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} days`;

  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} hrs`;

  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} mins`;

  return `${Math.floor(seconds)} secs`;
}

// we love switches
export const sortPosts = (posts, sortBy) => {
  return posts.sort((a, b) => {
    switch (sortBy) {
      case "asc":
        return a.title.localeCompare(b.title); // Sort A-Z
      case "desc":
        return b.title.localeCompare(a.title); // Sort Z-A
      case "newest":
        return new Date(b.created_at) - new Date(a.created_at); // Newest first
      case "oldest":
        return new Date(a.created_at) - new Date(b.created_at); // Oldest first
      case "most-upvoted":
        return b.upvotes - a.upvotes; // Sort by most upvoted
      case "most-total-votes":
        return b.total_votes - a.total_votes; // Sort by most total votes
      default:
        return 0; // Default to no sorting
    }
  });
};

export const formatVotes = (votes) => {
  if (votes >= 1000) {
    return (votes / 1000).toFixed(votes % 1000 >= 100 ? 1 : 0) + "K";
  }
  return votes;
};
