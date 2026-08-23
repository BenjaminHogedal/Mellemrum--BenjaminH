import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

const URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

export default function PostsPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function getPosts() {
      const response = await fetch(URL, { headers });
      const data = await response.json();
      setPosts(data);
    }

    getPosts();
  }, []);

  return (
    <>
      <header>
        <h1>Posts</h1>
      </header>
      <main>
        <section className="posts-grid" aria-label="Supabase posts">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      </main>
    </>
  );
}
