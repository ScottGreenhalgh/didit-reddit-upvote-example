"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const QueryButtons = ({ prefix }) => {
  const router = useRouter();
  const [postsPerPage, setPostsPerPage] = useState(4);

  const handleSort = (e, sortBy) => {
    e.preventDefault(); // Prevent default
    const newSearchParams = new URLSearchParams(window.location.search);
    newSearchParams.set("sortBy", sortBy); // Update the sortBy parameter
    router.push(`${prefix}?${newSearchParams.toString()}`); // Navigate with new params
  };

  const handlePostsPerPageChange = (e) => {
    const newPostsPerPage = e.target.value;
    setPostsPerPage(newPostsPerPage);

    const newSearchParams = new URLSearchParams(window.location.search);
    newSearchParams.set("postsPerPage", newPostsPerPage); // Update postsPerPage param
    router.push(`${prefix}?${newSearchParams.toString()}`);
  };

  return (
    <form className="flex gap-4">
      {/* Sorting buttons */}
      <button type="button" onClick={(e) => handleSort(e, "asc")}>
        Sort: A-Z
      </button>
      <button type="button" onClick={(e) => handleSort(e, "desc")}>
        Sort: Z-A
      </button>
      <button type="button" onClick={(e) => handleSort(e, "newest")}>
        Sort: Newest
      </button>
      <button type="button" onClick={(e) => handleSort(e, "oldest")}>
        Sort: Oldest
      </button>
      <button type="button" onClick={(e) => handleSort(e, "most-upvoted")}>
        Sort: Most Upvoted
      </button>
      <button type="button" onClick={(e) => handleSort(e, "most-total-votes")}>
        Sort: Most Total Votes
      </button>

      {/* Slider/input to select number of posts per page */}
      <div>
        <label htmlFor="postsPerPage">Posts per Page: </label>
        <input
          type="range"
          id="postsPerPage"
          name="postsPerPage"
          min="4"
          max="10"
          value={postsPerPage}
          onChange={handlePostsPerPageChange}
          className=" bg-gray-200 rounded-lg cursor-pointer"
        />
        <span>{postsPerPage}</span>
      </div>
    </form>
  );
};

export default QueryButtons;
