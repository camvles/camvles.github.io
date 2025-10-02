# Portfolio Project System

This directory contains all portfolio projects with their configurations and assets.

## 📁 Project Structure

Each project follows this structure:
```
project-name/
├── config.json          # Project configuration
├── assets/              # Project images and media
│   ├── main-display.jpg
│   ├── thumbnail-cover.jpg
│   ├── thumbnail-detail1.jpg
│   ├── thumbnail-detail2.jpg
│   └── thumbnail-detail3.jpg
└── content/             # Optional: Additional content files
    └── project-content.md
```

## 🚀 Creating a New Project

1. **Copy the template:**
   ```bash
   cp -r template/ your-project-name/
   ```

2. **Edit `config.json`:**
   - Update `projectId` (must match folder name)
   - Update `title`, `tags`, `category`
   - Update `externalLinks` if applicable
   - Customize `contentBlocks` for each thumbnail

3. **Add your images:**
   - Replace placeholder images in `assets/` folder
   - Recommended sizes:
     - Main display: 1920x1080px
     - Thumbnails: 160x120px

4. **Update the project switcher:**
   - Add a new button in `index.html`
   - Update the switcher JavaScript if needed

## 📝 Content Block Types

The flexible text block system supports 4 types:

### Header
- **Font Size:** 22px
- **Font Weight:** Semibold
- **Top Padding:** 0px
- **Use for:** Main section titles

### Subtitle
- **Font Size:** 18px
- **Font Weight:** Medium
- **Top Padding:** 10px
- **Use for:** Section subtitles

### Paragraph
- **Font Size:** 12px
- **Font Weight:** Regular
- **Top Padding:** 10px
- **Use for:** Body text, descriptions

### Bullet Point
- **Font Size:** 12px
- **Font Weight:** Regular
- **Top Padding:** 10px
- **Special:** 12px bullet + 10px gap
- **Use for:** Key points, features

## 🎨 JSON Configuration Example

```json
{
  "projectId": "my-project",
  "title": "My Amazing Project",
  "tags": ["UI/UX", "Web Design"],
  "thumbnails": [
    {
      "id": "cover",
      "name": "Cover",
      "image": "thumbnail-cover.jpg",
      "contentBlocks": [
        {
          "type": "header",
          "text": "Project Overview"
        },
        {
          "type": "subtitle",
          "text": "Brief project description"
        },
        {
          "type": "paragraph",
          "text": "Detailed project information..."
        },
        {
          "type": "bulletPoint",
          "text": "Key feature or benefit"
        }
      ]
    }
  ]
}
```

## 🔧 Advanced Features

- **Flexible Content:** Each thumbnail can have any number and combination of content blocks
- **Dynamic Loading:** Projects load from JSON files
- **Responsive Design:** Works on all screen sizes
- **Accessibility:** Full keyboard navigation and ARIA support
- **Image Optimization:** Automatic image path handling

## 📋 Best Practices

1. **Image Optimization:** Compress images for web use
2. **Content Hierarchy:** Use headers for main sections, subtitles for subsections
3. **Consistent Naming:** Use descriptive names for thumbnails and images
4. **Testing:** Test each project thoroughly before publishing
5. **Performance:** Keep image file sizes reasonable

## 🚨 Troubleshooting

- **Images not loading:** Check file paths in `config.json`
- **Content not displaying:** Verify JSON syntax and content block types
- **Styling issues:** Ensure CSS classes match the generated HTML
- **JavaScript errors:** Check browser console for detailed error messages
