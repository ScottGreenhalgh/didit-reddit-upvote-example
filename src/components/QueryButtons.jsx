"use client";

import React from "react";
import { useRouter } from "next/navigation";

const QueryButtons = ({ prefix }) => {
  const router = useRouter();

  const handleSort = (e, sortBy) => {
    e.preventDefault(); // Prevent default
    const newSearchParams = new URLSearchParams(window.location.search);
    newSearchParams.set("sortBy", sortBy); // Update the sortBy parameter
    router.push(`${prefix}?${newSearchParams.toString()}`); // Navigate with new params
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
    </form>
  );
};

export default QueryButtons;
