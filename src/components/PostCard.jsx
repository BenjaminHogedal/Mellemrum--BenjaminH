export default function PostCard({ post }) {
  const formattedDate = new Date(post.created_at).toLocaleString("da-DK", {
    dateStyle: "long",
    timeStyle: "short"
  });

  return (
    <article className="post-card">
      <img className="post-image" src={post.image} alt="" />
      <div className="post-card-content">
        <time className="post-time" dateTime={post.created_at}>
          {formattedDate}
        </time>
        <h2>{post.caption}</h2>
      </div>
    </article>
  );
}
