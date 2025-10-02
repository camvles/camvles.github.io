// Portfolio JavaScript - Dynamic Project Loading and Flexible Text Blocks

let currentProject = null;
let currentThumbnail = null;
let availableProjects = [];

document.addEventListener('DOMContentLoaded', function() {
    // Initialize portfolio functionality
    initializePortfolio();
});

async function initializePortfolio() {
    try {
        // Discover available projects first
        await discoverProjects();
        
        // Load the first available project
        if (availableProjects.length > 0) {
            await loadProject(availableProjects[0].id);
        }
        
        // Get all thumbnail buttons
        const thumbnailButtons = document.querySelectorAll('.thumbnail-btn');
        const displayedMedia = document.querySelector('.displayed-media img');
        
        // Add click event listeners to each thumbnail
        thumbnailButtons.forEach(button => {
            button.addEventListener('click', function() {
                handleThumbnailClick(this, thumbnailButtons, displayedMedia);
            });
            
            // Add hover effects
            button.addEventListener('mouseenter', function() {
                handleThumbnailHover(this, true);
            });
            
            button.addEventListener('mouseleave', function() {
                handleThumbnailHover(this, false);
            });
        });
        
        // Set initial state
        updateThumbnailStates(thumbnailButtons);
        
        // Initialize project switcher
        initializeProjectSwitcher();
    } catch (error) {
        console.error('Failed to initialize portfolio:', error);
    }
}

async function discoverProjects() {
    try {
        availableProjects = [];
        
        // Try to discover projects by attempting to fetch content.json files
        // We'll try a range of project numbers to find all existing projects
        // Any folder starting with 'project-' in the projects directory will be detected
        const maxProjects = 20; // Reasonable upper limit
        const projectPromises = [];
        
        // Create promises for all potential project folders
        for (let i = 1; i <= maxProjects; i++) {
            const projectId = `project-${i}`;
            projectPromises.push(
                fetch(`portfolio/projects/${projectId}/content.json`)
                    .then(response => {
                        if (response.ok) {
                            return response.json().then(projectData => ({
                                id: projectId,
                                title: projectData.title,
                                order: projectData.order || 999
                            }));
                        }
                        return null;
                    })
                    .catch(() => null) // Project doesn't exist, return null
            );
        }
        
        // Wait for all promises to resolve
        const results = await Promise.all(projectPromises);
        
        // Filter out null results (non-existent projects)
        availableProjects = results.filter(project => project !== null);
        
        // Sort projects by order (lower order numbers first)
        availableProjects.sort((a, b) => a.order - b.order);
        
        console.log('Discovered projects:', availableProjects.map(p => `${p.id}: ${p.title}`).join(', '));
        
        // If no projects found, show error
        if (availableProjects.length === 0) {
            console.error('No projects found! Please ensure project folders starting with "project-" exist with content.json files.');
            availableProjects = [
                { id: 'project-1', title: 'No Projects Found', order: 1 }
            ];
        }
    } catch (error) {
        console.error('Error discovering projects:', error);
        // Fallback to default projects if discovery fails
        availableProjects = [
            { id: 'project-1', title: 'Project 1', order: 1 },
            { id: 'project-2', title: 'Project 2', order: 2 }
        ];
    }
}

async function loadProject(projectId) {
    try {
        const response = await fetch(`portfolio/projects/${projectId}/content.json`);
        if (!response.ok) {
            throw new Error(`Failed to load project: ${response.status}`);
        }
        
        currentProject = await response.json();
        updateProjectDisplay();
    } catch (error) {
        console.error(`Error loading project ${projectId}:`, error);
    }
}

function updateProjectDisplay() {
    if (!currentProject) return;
    
    // Update project title
    const projectTitle = document.querySelector('.project-title');
    if (projectTitle) {
        projectTitle.textContent = currentProject.title;
    }
    
    // Update tags
    updateProjectTags();
    
    // Set initial display media (will be handled by first thumbnail click)
    
    // Update thumbnails
    updateThumbnails();
    
    // Set initial thumbnail content (cover thumbnail will be activated)
    const coverThumbnail = document.querySelector('.thumbnail-btn[data-name="thumbnail-cover"]');
    if (coverThumbnail) {
        handleThumbnailClick(coverThumbnail, document.querySelectorAll('.thumbnail-btn'), document.querySelector('.displayed-media img'));
    }
}


function updateProjectTags() {
    const tagsContainer = document.querySelector('.tags');
    if (!tagsContainer || !currentProject.tags) return;
    
    tagsContainer.innerHTML = '';
    
    currentProject.tags.forEach(tagId => {
        const tagElement = document.createElement('div');
        
        // Get tag configuration from centralized config
        const tagConfig = getTagConfig(tagId);
        
        // Apply CSS class and display text from config
        tagElement.className = `tag ${tagId}`;
        
        // Apply inline styles for colors
        tagElement.style.backgroundColor = tagConfig.backgroundColor;
        
        const tagTextElement = document.createElement('span');
        tagTextElement.className = 'tag-text';
        tagTextElement.textContent = tagConfig.displayText;
        tagTextElement.style.color = tagConfig.textColor;
        
        tagElement.appendChild(tagTextElement);
        tagsContainer.appendChild(tagElement);
    });
}

function updateDisplayedMedia(thumbnailData) {
    const displayedMedia = document.querySelector('.displayed-media img');
    if (displayedMedia && thumbnailData && thumbnailData.displayedMedia) {
        // Add a subtle transition effect
        displayedMedia.style.transition = 'opacity 0.3s ease';
        displayedMedia.style.opacity = '0.7';
        
        setTimeout(() => {
            displayedMedia.src = `portfolio/projects/${currentProject.projectId}/assets/${thumbnailData.displayedMedia.image}`;
            displayedMedia.alt = thumbnailData.displayedMedia.altText || 'Project display';
            displayedMedia.style.opacity = '1';
        }, 150);
    }
}

function updateThumbnails() {
    if (!currentProject) return;
    
    // Update cover thumbnail
    if (currentProject.cover) {
        const coverButton = document.querySelector('.thumbnail-btn[data-name="thumbnail-cover"]');
        if (coverButton) {
            const thumbnailImage = coverButton.querySelector('.thumbnail-image img');
            const thumbnailText = coverButton.querySelector('.thumbnail-text');
            
            if (thumbnailImage) {
                thumbnailImage.src = `portfolio/projects/${currentProject.projectId}/assets/${currentProject.cover.thumbnailImage}`;
                thumbnailImage.alt = currentProject.cover.thumbnailLabel;
            }
            
            if (thumbnailText) {
                thumbnailText.textContent = currentProject.cover.thumbnailLabel;
            }
        }
    }
    
    // Update detail thumbnails
    if (currentProject.details && currentProject.details.length > 0) {
        currentProject.details.forEach((detail, index) => {
            const detailButton = document.querySelector(`.thumbnail-btn[data-name="thumbnail-detail${index + 1}"]`);
            if (detailButton) {
                const thumbnailImage = detailButton.querySelector('.thumbnail-image img');
                const thumbnailText = detailButton.querySelector('.thumbnail-text');
                
                if (thumbnailImage) {
                    thumbnailImage.src = `portfolio/projects/${currentProject.projectId}/assets/${detail.thumbnailImage}`;
                    thumbnailImage.alt = detail.thumbnailLabel;
                }
                
                if (thumbnailText) {
                    thumbnailText.textContent = detail.thumbnailLabel;
                }
            }
        });
    }
    
    // Hide unused detail thumbnails
    for (let i = 1; i <= 3; i++) {
        const detailButton = document.querySelector(`.thumbnail-btn[data-name="thumbnail-detail${i}"]`);
        if (detailButton) {
            const hasDetail = currentProject.details && currentProject.details.length >= i;
            detailButton.style.display = hasDetail ? 'block' : 'none';
        }
    }
}

function handleThumbnailClick(clickedButton, allButtons, displayedMedia) {
    // Remove active class from all thumbnails
    allButtons.forEach(btn => {
        btn.classList.remove('active');
        const overlay = btn.querySelector('.thumbnail-overlay');
        const text = btn.querySelector('.thumbnail-text');
        
        if (overlay) {
            overlay.classList.remove('selected');
            overlay.style.backgroundColor = 'var(--ui-color-thumbnail-overlay-default)';
        }
        
        if (text) {
            text.style.opacity = '0';
        }
    });
    
    // Add active class to clicked thumbnail (this will apply the elevated styling)
    clickedButton.classList.add('active');
    const activeOverlay = clickedButton.querySelector('.thumbnail-overlay');
    const activeText = clickedButton.querySelector('.thumbnail-text');
    
    if (activeOverlay) {
        activeOverlay.classList.add('selected');
        activeOverlay.style.backgroundColor = 'var(--ui-color-thumbnail-overlay-selected)';
    }
    
    if (activeText) {
        activeText.style.opacity = '0.5';
    }
    
    // Update displayed media based on clicked thumbnail
    const thumbnailName = clickedButton.getAttribute('data-name');
    let thumbnailData = null;
    
    if (thumbnailName === 'thumbnail-cover') {
        thumbnailData = currentProject.cover;
    } else if (thumbnailName.startsWith('thumbnail-detail')) {
        const detailIndex = parseInt(thumbnailName.replace('thumbnail-detail', '')) - 1;
        thumbnailData = currentProject.details && currentProject.details[detailIndex];
    }
    
    updateDisplayedMedia(thumbnailData);
    
    // Update info content based on clicked thumbnail
    updateInfoContent(clickedButton);
}

function handleThumbnailHover(button, isHovering) {
    const overlay = button.querySelector('.thumbnail-overlay');
    const text = button.querySelector('.thumbnail-text');
    
    if (!button.classList.contains('active')) {
        if (isHovering) {
            // Hover state - show text
            if (text) {
                text.style.opacity = '1';
            }
        } else {
            // Normal state - hide text
            if (text) {
                text.style.opacity = '0';
            }
        }
    }
}


function updateInfoContent(activeButton) {
    // Get the thumbnail name to determine which content to show
    const thumbnailName = activeButton.getAttribute('data-name');
    let thumbnailData = null;
    
    if (thumbnailName === 'thumbnail-cover') {
        thumbnailData = currentProject.cover;
    } else if (thumbnailName.startsWith('thumbnail-detail')) {
        const detailIndex = parseInt(thumbnailName.replace('thumbnail-detail', '')) - 1;
        thumbnailData = currentProject.details && currentProject.details[detailIndex];
    }
    
    if (!thumbnailData || !thumbnailData.textBlocks) {
        console.warn('No text blocks found for thumbnail:', thumbnailName);
        return;
    }
    
    // Clear existing text blocks
    const infoBlocks = document.querySelector('.info-blocks');
    if (!infoBlocks) return;
    
    infoBlocks.innerHTML = '';
    
    // Create new text blocks based on the thumbnail data
    thumbnailData.textBlocks.forEach(block => {
        const blockElement = createTextBlock(block.type, block.text);
        infoBlocks.appendChild(blockElement);
    });
}

function createTextBlock(type, text) {
    const blockContainer = document.createElement('div');
    
    switch (type) {
        case 'header':
            blockContainer.className = 'text-block header-block';
            blockContainer.innerHTML = `<h2 class="header-text">${text}</h2>`;
            break;
            
        case 'subtitle':
            blockContainer.className = 'text-block subtitle-block';
            blockContainer.innerHTML = `<p class="subtitle-text">${text}</p>`;
            break;
            
        case 'paragraph':
            blockContainer.className = 'text-block paragraph-block';
            blockContainer.innerHTML = `<p class="paragraph-text">${text}</p>`;
            break;
            
        case 'bulletPoint':
            blockContainer.className = 'text-block bullet-block';
            blockContainer.innerHTML = `
                <div class="bullet-point"></div>
                <p class="bullet-text">${text}</p>
            `;
            break;
            
        default:
            console.warn('Unknown text block type:', type);
            return document.createElement('div');
    }
    
    return blockContainer;
}


function updateThumbnailStates(thumbnailButtons) {
    // Set initial active state for the cover thumbnail
    const coverThumbnail = document.querySelector('.thumbnail-btn[data-name="thumbnail-cover"]');
    if (coverThumbnail) {
        handleThumbnailClick(coverThumbnail, thumbnailButtons, document.querySelector('.displayed-media img'));
    }
}

// Keyboard navigation support
document.addEventListener('keydown', function(event) {
    const thumbnailButtons = document.querySelectorAll('.thumbnail-btn');
    const activeButton = document.querySelector('.thumbnail-btn.active');
    
    if (activeButton) {
        const currentIndex = Array.from(thumbnailButtons).indexOf(activeButton);
        let newIndex = currentIndex;
        
        switch (event.key) {
            case 'ArrowLeft':
                newIndex = currentIndex > 0 ? currentIndex - 1 : thumbnailButtons.length - 1;
                break;
            case 'ArrowRight':
                newIndex = currentIndex < thumbnailButtons.length - 1 ? currentIndex + 1 : 0;
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                handleThumbnailClick(activeButton, thumbnailButtons, document.querySelector('.displayed-media img'));
                return;
        }
        
        if (newIndex !== currentIndex) {
            event.preventDefault();
            handleThumbnailClick(thumbnailButtons[newIndex], thumbnailButtons, document.querySelector('.displayed-media img'));
        }
    }
});

// Add accessibility attributes
function initializeAccessibility() {
    const thumbnailButtons = document.querySelectorAll('.thumbnail-btn');
    
    thumbnailButtons.forEach((button, index) => {
        button.setAttribute('role', 'tab');
        button.setAttribute('tabindex', index === 0 ? '0' : '-1');
        button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        button.setAttribute('aria-label', `View ${button.getAttribute('data-name')} detail`);
    });
}

// Initialize accessibility on load
document.addEventListener('DOMContentLoaded', function() {
    initializeAccessibility();
});

// Project Switcher Functions
function initializeProjectSwitcher() {
    const projectSwitcher = document.querySelector('.project-switcher');
    if (!projectSwitcher) return;
    
    // Clear existing buttons
    projectSwitcher.innerHTML = '';
    
    // Generate buttons for each available project
    availableProjects.forEach((project, index) => {
        const button = document.createElement('button');
        button.className = `project-btn ${index === 0 ? 'active' : ''}`;
        button.setAttribute('data-project', project.id);
        button.textContent = project.title;
        
        button.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            switchProject(projectId);
            
            // Update active state
            projectSwitcher.querySelectorAll('.project-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
        
        projectSwitcher.appendChild(button);
    });
}

async function switchProject(projectId) {
    try {
        await loadProject(projectId);
        
        // Reset thumbnail states
        const thumbnailButtons = document.querySelectorAll('.thumbnail-btn');
        const firstThumbnail = thumbnailButtons[0];
        if (firstThumbnail) {
            handleThumbnailClick(firstThumbnail, thumbnailButtons, document.querySelector('.displayed-media img'));
        }
    } catch (error) {
        console.error('Failed to switch project:', error);
    }
}
