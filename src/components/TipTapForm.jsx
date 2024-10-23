"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const TipTapForm = ({ onSubmit }) => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const editor = useEditor({
    extensions: [StarterKit],
    content: `<p>Write your post here...</p>`,
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm bg-white", // Example of adding custom styling
      },
    },
    shouldCreateEditor: typeof window !== "undefined",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    onSubmit(formData); // Call the server action to submit the post
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        type="text"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title..."
        className="text-black px-3 py-2 rounded"
      />
      {editor && <EditorContent editor={editor} />}
      <button className="bg-green-400 px-4 py-2 text-xl text-black rounded">
        Submit post
      </button>
    </form>
  );
};

export default TipTapForm;
