// Centralized Tag Configuration with Colors
// This file contains all tag definitions with their IDs, display text, colors, and styling

const TAG_CONFIG = {
  // Design & UI/UX Tags
  'ux-ui': {
    displayText: 'UX/UI',
    backgroundColor: '#9a9a9a',
    textColor: '#000000'
  },
  'ui-ux': {
    displayText: 'UI/UX',
    backgroundColor: '#1abc9c',
    textColor: '#ffffff'
  },
  'web-design': {
    displayText: 'Web Design',
    backgroundColor: '#4a90e2',
    textColor: '#ffffff'
  },
  'graphic-design': {
    displayText: 'Graphic Design',
    backgroundColor: '#e67e22',
    textColor: '#ffffff'
  },

  // Mobile & Platform Tags
  'mobile': {
    displayText: 'Mobile',
    backgroundColor: '#50c878',
    textColor: '#ffffff'
  },
  'ios': {
    displayText: 'iOS',
    backgroundColor: '#000000',
    textColor: '#ffffff'
  },
  'android': {
    displayText: 'Android',
    backgroundColor: '#3ddc84',
    textColor: '#000000'
  },

  // 3D & Game Design Tags
  'three-d-design': {
    displayText: '3D Design',
    backgroundColor: '#ff6b6b',
    textColor: '#ffffff'
  },
  'game-design': {
    displayText: 'Game Design',
    backgroundColor: '#8e44ad',
    textColor: '#ffffff'
  },
  'animation': {
    displayText: 'Animation',
    backgroundColor: '#e91e63',
    textColor: '#ffffff'
  },

  // Branding & Logo Tags
  'logo-design': {
    displayText: 'Logo Design',
    backgroundColor: '#f39c12',
    textColor: '#000000'
  },
  'branding': {
    displayText: 'Branding',
    backgroundColor: '#e74c3c',
    textColor: '#ffffff'
  },
  'illustration': {
    displayText: 'Illustration',
    backgroundColor: '#f1c40f',
    textColor: '#000000'
  },

  // Photography & Video Tags
  'photography': {
    displayText: 'Photography',
    backgroundColor: '#2c3e50',
    textColor: '#ffffff'
  },
  'video-editing': {
    displayText: 'Video Editing',
    backgroundColor: '#795548',
    textColor: '#ffffff'
  },

  // Development Tags
  'frontend': {
    displayText: 'Frontend',
    backgroundColor: '#3498db',
    textColor: '#ffffff'
  },
  'backend': {
    displayText: 'Backend',
    backgroundColor: '#34495e',
    textColor: '#ffffff'
  },
  'fullstack': {
    displayText: 'Full Stack',
    backgroundColor: '#9b59b6',
    textColor: '#ffffff'
  },
  'javascript': {
    displayText: 'JavaScript',
    backgroundColor: '#f7df1e',
    textColor: '#000000'
  },
  'react': {
    displayText: 'React',
    backgroundColor: '#61dafb',
    textColor: '#000000'
  },
  'vue': {
    displayText: 'Vue.js',
    backgroundColor: '#4fc08d',
    textColor: '#ffffff'
  },
  'angular': {
    displayText: 'Angular',
    backgroundColor: '#dd0031',
    textColor: '#ffffff'
  },
  'node': {
    displayText: 'Node.js',
    backgroundColor: '#68a063',
    textColor: '#ffffff'
  },
  'python': {
    displayText: 'Python',
    backgroundColor: '#3776ab',
    textColor: '#ffffff'
  },

  // Technology Tags
  'figma': {
    displayText: 'Figma',
    backgroundColor: '#f24e1e',
    textColor: '#ffffff'
  },
  'sketch': {
    displayText: 'Sketch',
    backgroundColor: '#fdad00',
    textColor: '#000000'
  },
  'photoshop': {
    displayText: 'Photoshop',
    backgroundColor: '#31a8ff',
    textColor: '#ffffff'
  },
  'illustrator': {
    displayText: 'Illustrator',
    backgroundColor: '#ff9a00',
    textColor: '#000000'
  },
  'blender': {
    displayText: 'Blender',
    backgroundColor: '#f5792a',
    textColor: '#ffffff'
  },
  'unity': {
    displayText: 'Unity',
    backgroundColor: '#000000',
    textColor: '#ffffff'
  },

  // Category Tags
  'responsive': {
    displayText: 'Responsive',
    backgroundColor: '#27ae60',
    textColor: '#ffffff'
  },
  'accessibility': {
    displayText: 'Accessibility',
    backgroundColor: '#8e44ad',
    textColor: '#ffffff'
  },
  'performance': {
    displayText: 'Performance',
    backgroundColor: '#e67e22',
    textColor: '#ffffff'
  },
  'user-research': {
    displayText: 'User Research',
    backgroundColor: '#16a085',
    textColor: '#ffffff'
  },

  // Custom tag fallback
  'custom': {
    displayText: 'Custom',
    backgroundColor: '#95a5a6',
    textColor: '#ffffff'
  }
};

// Function to get tag configuration by ID
function getTagConfig(tagId) {
  return TAG_CONFIG[tagId] || TAG_CONFIG['custom'];
}

// Function to get all available tag IDs
function getAllTagIds() {
  return Object.keys(TAG_CONFIG);
}

// Function to generate CSS for all tags dynamically
function generateTagCSS() {
  let css = `
/* Auto-generated Tag Styles */
.tag {
  border-radius: 10px;
  padding: 0 10px;
  display: flex;
  gap: 2px;
  align-items: center;
  position: relative;
  flex-shrink: 0;
}

.tag-text {
  font-family: var(--font-baloo-2);
  font-weight: var(--text-weight-regular);
  font-size: var(--text-size-tag);
  line-height: 1.32;
  text-align: center;
  white-space: nowrap;
}

`;

  // Generate CSS for each tag
  Object.keys(TAG_CONFIG).forEach(tagId => {
    const config = TAG_CONFIG[tagId];
    css += `
.tag.${tagId} {
  background-color: ${config.backgroundColor};
}

.tag.${tagId} .tag-text {
  color: ${config.textColor};
}

`;
  });

  return css;
}

// Function to inject CSS into the page
function injectTagCSS() {
  const style = document.createElement('style');
  style.textContent = generateTagCSS();
  document.head.appendChild(style);
}

// Auto-inject CSS when the script loads
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', injectTagCSS);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TAG_CONFIG, getTagConfig, getAllTagIds, generateTagCSS };
}
