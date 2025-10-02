// Project Showcase JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Image assets (these would be replaced with actual image URLs in production)
    const images = {
        main: 'http://localhost:3845/assets/55fd77d20f5b9f1a2619c2b0e892509fc932d755.png',
        detail1: 'http://localhost:3845/assets/377c768f738ecab57fcf189877be86a90d20c470.png',
        detail2: 'http://localhost:3845/assets/6ad5f7fb321b2c764f72a05d3e22ae265f6d09c2.png',
        detail3: 'http://localhost:3845/assets/68a50e0ee76fabe5148fe12a5ee72f2947f518d9.png',
        cover: 'http://localhost:3845/assets/55fd77d20f5b9f1a2619c2b0e892509fc932d755.png',
        about: 'http://localhost:3845/assets/9ad5f7fb321b2c764f72a05d3e22ae265f6d09c2.svg'
    };

    // Initialize the showcase
    initProjectShowcase();

    function initProjectShowcase() {
        // Set initial main image
        setMainImage(images.cover);
        
        // Set thumbnail background images
        setThumbnailImages();
        
        // Set about button image
        setAboutButtonImage();
        
        // Add event listeners
        addEventListeners();
        
        // Initialize project navigation
        initProjectNavigation();
    }

    function setMainImage(imageUrl) {
        const mainImage = document.getElementById('mainImage');
        if (mainImage) {
            mainImage.style.backgroundImage = `url('${imageUrl}')`;
        }
    }

    function setThumbnailImages() {
        // Set background images for thumbnails
        const detail1Fond = document.getElementById('detail1-fond');
        const detail2Fond = document.getElementById('detail2-fond');
        const detail3Fond = document.getElementById('detail3-fond');
        const coverFond = document.getElementById('cover-fond');

        if (detail1Fond) detail1Fond.style.backgroundImage = `url('${images.detail1}')`;
        if (detail2Fond) detail2Fond.style.backgroundImage = `url('${images.detail2}')`;
        if (detail3Fond) detail3Fond.style.backgroundImage = `url('${images.detail3}')`;
        if (coverFond) coverFond.style.backgroundImage = `url('${images.cover}')`;
    }

    function setAboutButtonImage() {
        const aboutButton = document.querySelector('.about-button .button-inner');
        if (aboutButton) {
            aboutButton.style.backgroundImage = `url('${images.about}')`;
            aboutButton.style.backgroundSize = 'cover';
            aboutButton.style.backgroundPosition = 'center';
            aboutButton.style.backgroundRepeat = 'no-repeat';
        }
    }

    function addEventListeners() {
        // Thumbnail click events
        const thumbnailButtons = document.querySelectorAll('.thumbnail-btn');
        thumbnailButtons.forEach(button => {
            button.addEventListener('click', function() {
                const imageType = this.getAttribute('data-image');
                handleThumbnailClick(imageType);
            });
        });

        // Project navigation events
        const projectButtons = document.querySelectorAll('.project-button');
        projectButtons.forEach(button => {
            button.addEventListener('click', function() {
                const projectId = this.getAttribute('data-project');
                handleProjectNavigation(projectId);
            });
        });

        // About button event
        const aboutButton = document.querySelector('.about-button');
        if (aboutButton) {
            aboutButton.addEventListener('click', handleAboutClick);
        }
    }

    function handleThumbnailClick(imageType) {
        // Update main image based on thumbnail clicked
        switch(imageType) {
            case 'detail1':
                setMainImage(images.detail1);
                break;
            case 'detail2':
                setMainImage(images.detail2);
                break;
            case 'detail3':
                setMainImage(images.detail3);
                break;
            case 'cover':
                setMainImage(images.cover);
                break;
        }

        // Add visual feedback for selected thumbnail
        updateThumbnailSelection(imageType);
    }

    function updateThumbnailSelection(selectedType) {
        // Remove previous selection styling
        document.querySelectorAll('.thumbnail-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Add selection styling to clicked thumbnail
        const selectedButton = document.querySelector(`[data-image="${selectedType}"]`);
        if (selectedButton) {
            selectedButton.classList.add('selected');
        }
    }

    function handleProjectNavigation(projectId) {
        // Update current project indicator
        document.querySelectorAll('.project-button').forEach(btn => {
            btn.classList.remove('current');
        });

        const currentButton = document.querySelector(`[data-project="${projectId}"]`);
        if (currentButton) {
            currentButton.classList.add('current');
        }

        // Here you would typically load different project content
        console.log(`Switched to project ${projectId}`);
        
        // For now, just update the main image to show project change
        // In a real implementation, you'd load different project data
        loadProjectContent(projectId);
    }

    function loadProjectContent(projectId) {
        // This function would load different project content based on the project ID
        // For now, we'll just show a placeholder or the cover image
        setMainImage(images.cover);
        
        // Reset thumbnail selection
        document.querySelectorAll('.thumbnail-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
    }

    function handleAboutClick() {
        // Handle about button click
        console.log('About button clicked');
        // You could open a modal, navigate to about page, etc.
    }

    function initProjectNavigation() {
        // Set initial project as current (Project 1)
        const firstProject = document.querySelector('[data-project="1"]');
        if (firstProject) {
            firstProject.classList.add('current');
        }
    }

    // Add hover effects for better UX
    function addHoverEffects() {
        const thumbnailButtons = document.querySelectorAll('.thumbnail-btn');
        thumbnailButtons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
                this.style.transition = 'transform 0.2s ease';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });

        const projectButtons = document.querySelectorAll('.project-button');
        projectButtons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                if (!this.classList.contains('current')) {
                    this.style.opacity = '0.8';
                    this.style.transition = 'opacity 0.2s ease';
                }
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.opacity = '1';
            });
        });
    }

    // Initialize hover effects
    addHoverEffects();

    // Add keyboard navigation support
    function addKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            switch(e.key) {
                case 'ArrowLeft':
                    // Navigate to previous project
                    navigateProjects(-1);
                    break;
                case 'ArrowRight':
                    // Navigate to next project
                    navigateProjects(1);
                    break;
                case 'Escape':
                    // Reset to cover image
                    setMainImage(images.cover);
                    updateThumbnailSelection('cover');
                    break;
            }
        });
    }

    function navigateProjects(direction) {
        const currentButton = document.querySelector('.project-button.current');
        if (!currentButton) return;

        const currentProjectId = parseInt(currentButton.getAttribute('data-project'));
        const totalProjects = document.querySelectorAll('.project-button').length;
        
        let newProjectId = currentProjectId + direction;
        
        // Wrap around
        if (newProjectId < 1) newProjectId = totalProjects;
        if (newProjectId > totalProjects) newProjectId = 1;
        
        handleProjectNavigation(newProjectId.toString());
    }

    // Initialize keyboard navigation
    addKeyboardNavigation();
});
