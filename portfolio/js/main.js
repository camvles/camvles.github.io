// Portfolio JavaScript - Dynamic Project Loading and Flexible Text Blocks

let currentProject = null;
let currentThumbnail = null;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize portfolio functionality
    initializePortfolio();
});

async function initializePortfolio() {
    try {
        // Load the default project
        await loadProject('project-1');
        
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

async function loadProject(projectId) {
    try {
        const response = await fetch(`portfolio/projects/${projectId}/config.json`);
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
    
    // Update project switcher button labels
    updateProjectSwitcherLabels();
    
    // Update tags
    updateProjectTags();
    
    // Update main display image
    updateMainDisplayImage();
    
    // Update thumbnails
    updateThumbnails();
    
    // Set initial thumbnail content
    const firstThumbnail = document.querySelector('.thumbnail-btn[data-name="thumbnail-cover"]');
    if (firstThumbnail) {
        handleThumbnailClick(firstThumbnail, document.querySelectorAll('.thumbnail-btn'), document.querySelector('.displayed-media img'));
    }
}

function updateProjectSwitcherLabels() {
    const projectButtons = document.querySelectorAll('.project-btn');
    projectButtons.forEach(button => {
        const projectId = button.getAttribute('data-project');
        if (projectId === currentProject.projectId) {
            button.textContent = currentProject.title;
        }
    });
}

function updateProjectTags() {
    const tagsContainer = document.querySelector('.tags');
    if (!tagsContainer || !currentProject.tags) return;
    
    tagsContainer.innerHTML = '';
    
    currentProject.tags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag';
        tagElement.innerHTML = `<span class="tag-text">${tag}</span>`;
        tagsContainer.appendChild(tagElement);
    });
}

function updateMainDisplayImage() {
    const displayedMedia = document.querySelector('.displayed-media img');
    if (displayedMedia && currentProject.mainDisplay) {
        displayedMedia.src = `portfolio/projects/${currentProject.projectId}/assets/${currentProject.mainDisplay.image}`;
        displayedMedia.alt = currentProject.mainDisplay.altText || 'Project main display';
    }
}

function updateThumbnails() {
    if (!currentProject.thumbnails) return;
    
    currentProject.thumbnails.forEach((thumbnail, index) => {
        const thumbnailButton = document.querySelector(`.thumbnail-btn[data-name="thumbnail-${thumbnail.id}"]`);
        if (thumbnailButton) {
            const thumbnailImage = thumbnailButton.querySelector('.thumbnail-image img');
            if (thumbnailImage) {
                thumbnailImage.src = `portfolio/projects/${currentProject.projectId}/assets/${thumbnail.image}`;
                thumbnailImage.alt = thumbnail.name;
            }
            
            const thumbnailText = thumbnailButton.querySelector('.thumbnail-text');
            if (thumbnailText) {
                thumbnailText.textContent = thumbnail.name;
            }
        }
    });
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
    
    // Add active class to clicked thumbnail
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
    updateDisplayedMedia(clickedButton, displayedMedia);
    
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

function updateDisplayedMedia(activeButton, displayedMedia) {
    // Get the image source from the active thumbnail
    const thumbnailImage = activeButton.querySelector('.thumbnail-image img');
    
    if (thumbnailImage && displayedMedia) {
        // In a real implementation, you would have different images for each thumbnail
        // For now, we'll use the same placeholder but you can extend this
        const imageSrc = thumbnailImage.src;
        displayedMedia.src = imageSrc;
        
        // Add a subtle transition effect
        displayedMedia.style.transition = 'opacity 0.3s ease';
        displayedMedia.style.opacity = '0.7';
        
        setTimeout(() => {
            displayedMedia.style.opacity = '1';
        }, 150);
    }
}

function updateInfoContent(activeButton) {
    // Get the thumbnail name to determine which content to show
    const thumbnailName = activeButton.getAttribute('data-name');
    const thumbnailId = thumbnailName.replace('thumbnail-', '');
    
    // Find the thumbnail data from current project
    const thumbnailData = currentProject?.thumbnails?.find(t => t.id === thumbnailId);
    
    if (!thumbnailData || !thumbnailData.contentBlocks) {
        console.warn('No content blocks found for thumbnail:', thumbnailId);
        return;
    }
    
    // Clear existing content blocks
    const infoBlocks = document.querySelector('.info-blocks');
    if (!infoBlocks) return;
    
    infoBlocks.innerHTML = '';
    
    // Create new content blocks based on the thumbnail data
    thumbnailData.contentBlocks.forEach(block => {
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
    const coverThumbnail = document.querySelector('.thumbnail-cover');
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
    const projectButtons = document.querySelectorAll('.project-btn');
    
    projectButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            switchProject(projectId);
            
            // Update active state
            projectButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
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
