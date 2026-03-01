import Layout from "@/components/Layout";
import { Link, useParams } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import { Calendar, Clock, ArrowLeft } from "lucide-react";

const BlogList = () => (
  <Layout>
    <div className="container max-w-3xl py-10">
      <h1 className="text-3xl font-bold mb-2">SAT Prep Blog</h1>
      <p className="text-muted-foreground mb-8">Tips, strategies, and guides to help you ace the SAT.</p>
      <div className="space-y-4">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="block p-6 rounded-xl border bg-card card-shadow hover:card-shadow-md transition-shadow"
          >
            <h2 className="text-lg font-semibold mb-2 font-sans">{post.title}</h2>
            <p className="text-sm text-muted-foreground mb-3">{post.excerpt}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
              <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </Layout>
);

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return (
    <Layout>
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <Link to="/blog" className="text-primary hover:underline">Back to Blog</Link>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <article className="container max-w-3xl py-10">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Blog
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
          <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
          <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
        </div>
        <div className="prose prose-sm max-w-none">
          {post.content.split("\n\n").map((para, i) => {
            if (para.startsWith("**") && para.endsWith("**")) {
              return <h3 key={i} className="text-lg font-semibold mt-6 mb-2 font-sans">{para.replace(/\*\*/g, "")}</h3>;
            }
            if (para.startsWith("**")) {
              const parts = para.split("**");
              return (
                <div key={i} className="mb-4">
                  <h3 className="text-base font-semibold mt-5 mb-1 font-sans">{parts[1]}</h3>
                  <p className="text-muted-foreground leading-relaxed">{parts[2]}</p>
                </div>
              );
            }
            if (para.startsWith("- ")) {
              return (
                <ul key={i} className="list-disc pl-5 space-y-1 text-muted-foreground mb-4">
                  {para.split("\n").map((line, j) => (
                    <li key={j}>{line.replace("- ", "")}</li>
                  ))}
                </ul>
              );
            }
            return <p key={i} className="text-muted-foreground leading-relaxed mb-4">{para}</p>;
          })}
        </div>
      </article>
    </Layout>
  );
};

export { BlogList, BlogPost };
