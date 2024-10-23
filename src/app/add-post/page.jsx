import TipTapForm from "@/components/TipTapForm";
import { auth, signIn } from "@/utils/auth";
import { db } from "@/utils/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  async function handleLogin() {
    "use server";
    await signIn();
  }

  async function savePost(formData) {
    "use server";
    const content = formData.get("content");
    const title = formData.get("title");
    const userId = session?.user?.id;

    if (!userId) {
      await signIn();
      return;
    }

    await db.query(
      "INSERT INTO posts (title, body, user_id) VALUES ($1, $2, $3)",
      [title, content, userId]
    );

    revalidatePath("/");
    redirect("/");
  }

  if (!session) {
    return (
      <div className="max-w-screen-lg mx-auto p-4 mt-10">
        You need to login to create a post
        <form action={handleLogin} className="inline">
          <button className="bg-pink-300 text-black px-3 py-2 rounded">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto p-4 bg-zinc-800 mt-10 rounded-xl">
      <h2 className="text-3xl mb-4  text-white">Add a new post</h2>
      <TipTapForm onSubmit={savePost} />
    </div>
  );
}
