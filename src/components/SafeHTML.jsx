"use client"; // Ensure this is a client-side component

import DOMPurify from "dompurify";
// sanatizing the html to avoid potential risks of allowing any html on the page
const SafeHTML = ({ html }) => {
  const sanitizedHTML = DOMPurify.sanitize(html);

  return (
    <div
      className="whitespace-pre-wrap m-4"
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
};

export default SafeHTML;
