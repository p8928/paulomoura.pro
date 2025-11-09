# Creating Blog Posts for Moura Website

This guide explains how to create new blog posts that will appear on the /blog page.

## 1. Content Structure

The blog posts are stored in `/src/content/blog/` as Markdown files with the `.md` extension. Each post has two main parts:

### Frontmatter (Meta Data)
At the top of each Markdown file, enclosed in `---`:
```markdown
---
title: "Your Post Title"
description: "A brief description of your post for SEO and previews"
publishDate: 2024-11-05  # Use YYYY-MM-DD format
tags: ["Tag1", "Tag2"]    # At least one tag is recommended
author: "Paulo Moura"
image: 
  url: "/path/to/your/image.jpg"
  alt: "Description of your image"
---
```

### Content Body
The main content of your post written in Markdown format, which can include:
- Headers (`#`, `##`, `###`)
- Paragraphs
- Lists (ordered and unordered)
- Links, images
- Blockquotes
- Any HTML elements if needed

## 2. How to Create a New Post

1. **Create a new Markdown file** in the `/src/content/blog/` directory
   - Use a descriptive filename using kebab-case (e.g., `como-melhorar-seo-em-2024.md`)
   - The filename will be used in the URL (e.g., `/blog/como-melhorar-seo-em-2024/`)

2. **Add frontmatter** at the beginning of your file with the required fields:
   - `title` - Title of your post
   - `description` - A concise summary of your post content
   - `publishDate` - Publish date in YYYY-MM-DD format
   - `tags` - An array of relevant tags for categorization
   - `author` - The author's name
   - `image` (optional) - Object with `url` and `alt` properties

3. **Write your content** in Markdown format after the closing `---` of the frontmatter

## 3. Special Components

Your content can use special components defined in the codebase:

- `HighlightedContent` - For special notes, tips, or cautions:
  ```astro
  <HighlightedContent type="tip/caution/note/highlight">
    Your highlighted content here
  </HighlightedContent>
  ```

- Table of Contents - Create a TOC by adding a `<TableOfContents>` slot with links to your headers:
  ```astro
  <TableOfContents slot="toc">
    <li><a href="#your-header-id">Your Header Text</a></li>
  </TableOfContents>
  ```

## 4. Important Notes

- The example post (`exemplo-post.astro`) is a template that pulls content from `/src/content/blog/branding-e-experiencia-do-cliente.md`
- When you create new posts in the content collection, they automatically appear on the `/blog` page
- The blog page sorts posts by publish date (newest first)
- The first 6 posts are shown initially, with a "Load more" button to show additional posts
- Make sure to include proper IDs in your headers if you want them linked in the table of contents
- Images referenced in your content should be placed in the `/public/` directory

## 5. Example Structure

```markdown
---
title: "The Future of Digital Marketing in 2024"
description: "An analysis of emerging trends in digital marketing and how businesses can prepare for the future."
publishDate: 2024-11-05
tags: ["Marketing", "Trends", "Strategy"]
author: "Paulo Moura"
image:
  url: "/img/blog/digital-marketing-future.jpg"
  alt: "Visualization of future digital marketing trends"
---

# The Future of Digital Marketing

Your content starts here...

## First Section

Content for your first section...

<HighlightedContent type="tip">
A helpful tip related to your content
</HighlightedContent>

## Second Section

More content...

```

Following this structure, your new blog posts will integrate seamlessly with the existing blog system and automatically appear on the /blog page with proper styling and functionality.