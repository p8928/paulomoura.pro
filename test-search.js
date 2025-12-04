// Script temporário para testar a funcionalidade de busca
import { getCollection } from 'astro:content';

async function testSearch() {
  try {
    console.log('Carregando todos os posts da coleção "blog"...');
    
    const allPosts = await getCollection('blog');
    console.log(`Total de posts carregados: ${allPosts.length}`);
    
    console.log('\nDetalhes dos posts:');
    allPosts.forEach((post, index) => {
      console.log(`\nPost ${index + 1}:`);
      console.log(`  Título: ${post.data.title}`);
      console.log(`  Descrição: ${post.data.description}`);
      console.log(`  Tags: [${post.data.tags.join(', ')}]`);
      console.log(`  Slug: ${post.slug}`);
      console.log(`  Data de publicação: ${post.data.publishDate}`);
    });
    
    console.log('\nTestando busca por "autenticidade"...');
    const query = 'autenticidade';
    const filteredPosts = allPosts.filter(post => {
      const title = post.data.title ? post.data.title.toLowerCase() : '';
      const description = post.data.description ? post.data.description.toLowerCase() : '';
      const tags = post.data.tags ? post.data.tags.map(tag => tag.toLowerCase()) : [];
      
      const searchQuery = query.toLowerCase();
      
      return (
        title.includes(searchQuery) ||
        description.includes(searchQuery) ||
        tags.some(tag => tag.includes(searchQuery))
      );
    });
    
    console.log(`Encontrados ${filteredPosts.length} posts para a busca "${query}"`);
    filteredPosts.forEach(post => {
      console.log(`  - ${post.data.title}`);
    });
    
  } catch (error) {
    console.error('Erro ao testar a busca:', error);
  }
}

testSearch();