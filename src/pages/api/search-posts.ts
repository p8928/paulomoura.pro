import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  // Parse the URL from the request
  const url = new URL(request.url);
  const query = url.searchParams.get('q')?.trim() || '';
  const limit = parseInt(url.searchParams.get('limit') || '12');
  
  console.log('=== SEARCH API DEBUG INFO ===');
  console.log('Full request URL:', request.url);
  console.log('Parsed URL:', url.toString());
  console.log('Search query received:', query);
  console.log('All search params:', Object.fromEntries(url.searchParams));
  
  if (!query) {
    console.log('No query provided, returning empty results');
    return new Response(JSON.stringify({ posts: [], total: 0 }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Get all blog posts
    const allPosts = await getCollection('blog');
    console.log('Total posts loaded:', allPosts.length);
    
    // Log the first few posts to see their structure
    if (allPosts.length > 0) {
      console.log('First post data:', {
        title: allPosts[0].data.title,
        description: allPosts[0].data.description,
        tags: allPosts[0].data.tags,
        slug: allPosts[0].slug
      });
    }
    
    // Filter posts based on search query across title, description, and tags
    const filteredPosts = allPosts.filter(post => {
      // Convert all text to lowercase for case-insensitive search
      const title = post.data.title ? post.data.title.toLowerCase() : '';
      const description = post.data.description ? post.data.description.toLowerCase() : '';
      const tags = post.data.tags ? post.data.tags.map(tag => tag.toLowerCase()) : [];
      
      const searchQuery = query.toLowerCase();
      
      console.log(`Processing post: "${title}", description: "${description.substring(0, 50)}...", tags: [${tags.join(', ')}]`);
      
      // Check if search query exists in any of the fields
      const match = (
        title.includes(searchQuery) ||
        description.includes(searchQuery) ||
        tags.some(tag => tag.includes(searchQuery))
      );
      
      if (match) {
        console.log(`MATCH FOUND for "${searchQuery}" in post "${title}"`);
        console.log(`  - Title match: ${title.includes(searchQuery)}`);
        console.log(`  - Description match: ${description.includes(searchQuery)}`);
        console.log(`  - Tags match: ${tags.some(tag => tag.includes(searchQuery))}`);
      }
      
      return match;
    });

    console.log(`Found ${filteredPosts.length} matching posts for query: "${query}"`);

    // Sort posts by date (newest first)
    const sortedPosts = filteredPosts.sort((a, b) => 
      b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
    );

    // Limit results
    const limitedPosts = sortedPosts.slice(0, limit);
    console.log(`Returning ${limitedPosts.length} posts (limited to ${limit})`);

    // Format posts data
    const formattedPosts = limitedPosts.map(post => ({
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
      query
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in search API:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      posts: [],
      total: 0
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};