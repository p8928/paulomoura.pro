// src/pages/api/contact.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('=== Form submission received ===');
    
    // Check content type
    const contentType = request.headers.get('content-type');
    console.log('Content type:', contentType);
    
    let data: Record<string, string> = {};
    
    if (contentType && contentType.includes('application/json')) {
      // Handle JSON data
      console.log('Parsing JSON data...');
      data = await request.json();
      console.log('Received JSON data:', data);
    } else {
      // Handle FormData
      console.log('Parsing FormData...');
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        data[key] = value.toString();
      }
      console.log('Received FormData:', data);
    }
    
    // Validate that we received data
    if (Object.keys(data).length === 0) {
      console.log('Warning: No data received in the request');
    }
    
    // Here you would typically send the data to your CRM or email service
    // For now, we'll just simulate processing
    console.log('Simulating processing delay...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Processing completed');
    
    // For now, just return a simple success response
    return new Response('OK', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('=== Error processing form ===');
    console.error('Error:', error);
    console.error('Error stack:', error.stack);
    
    // Return simple error response
    return new Response('Error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
};