import Link from "next/link";
import { signIn, signOut } from "@/utils/auth";
import auth from "../app/middleware";

export default async function Header() {
  const session = await auth();

  async function handleLogin() {
    "use server";
    await signIn();
  }

  async function handleLogout() {
    "use server";
    await signOut();
  }

  return (
    <header className="border-b border-zinc-200 p-4 flex items-center shadow-lg sticky top-0 bg-white bg-opacity-65 backdrop-blur-sm">
      <Link href="/" className="text-xl">
        Didit
      </Link>
      <Link
        href="/add-post"
        className="ml-10 hover:bg-zinc-300 p-2 rounded bg-pink-300 text-black"
      >
        Add post
      </Link>
      <div className="ml-auto">
        {session ? (
          <div>
            <Link href={`/u/${session.user.name.replace(/ /g, "-")}`}>
              {session.user.name}{" "}
              <span className="text-xs text-zinc-400 mr-3">
                #{session.user.id}
              </span>
            </Link>
            <form action={handleLogout} className="inline">
              <button className="bg-pink-300 hover:bg-zinc-300 text-black px-3 py-2 rounded">
                Logout
              </button>
            </form>
          </div>
        ) : (
          <div>
            <span className="mr-4">Welcome, Guest!</span>
            <form action={handleLogin} className="inline">
              <button className="bg-pink-300 hover:bg-zinc-300 text-black px-3 py-2 rounded">
                Login
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
