import { getCollection } from 'astro:content';

export async function GET({ request }) {
  const url = new URL(request.url);
  const start = parseInt(url.searchParams.get('start') || '0');
  const limit = parseInt(url.searchParams.get('limit') || '6');
  
  // Get all blog posts
  const allPosts = await getCollection('blog');
  
  // Sort posts by date
  const sortedPosts = allPosts.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
  
  // Slice posts based on start and limit
  const posts = sortedPosts.slice(start, start + limit);
  
  // Format posts data
  const formattedPosts = posts.map(post => ({
    slug: post.slug,
    title: post.data.title,
    description: post.data.description,
    publishDate: post.data.publishDate,
    tags: post.data.tags,
    image: post.data.image || null,
  }));
  
  return new Response(JSON.stringify({
    posts: formattedPosts,
    total: sortedPosts.length,
    start,
    limit
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}