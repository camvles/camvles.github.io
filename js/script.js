console.log("Portfolio loaded!");

// Layout switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const mediaLayout = document.querySelector('.media-layout');
    const summaryThumbnails = document.querySelectorAll('.summary-thumbnail-1, .summary-thumbnail-2, .summary-thumbnail-3, .summary-thumbnail-4');
    const projectTitle = document.querySelector('.project-title');
    const projectDetails = document.querySelector('.project-details');
    const summaryParagraph = document.querySelector('.project-summary p');

    // Function to calculate and set title scale
    function updateTitleScale() {
        if (projectTitle && projectDetails) {
            const containerWidth = projectDetails.offsetWidth;
            const titleWidth = projectTitle.scrollWidth;
            
            // Calculate scale factor to fit title within container
            // Use a maximum scale of 1 and minimum scale of 0.6
            const scale = Math.min(1, Math.max(0.4, containerWidth / titleWidth));
            
            projectTitle.style.setProperty('--title-scale', scale);
        }
    }

    // Function to calculate and set summary scale
    function updateSummaryScale() {
        if (summaryParagraph && projectDetails) {
            const containerWidth = projectDetails.offsetWidth;
            
            // Scale based on container width with reasonable bounds
            // Scale from 0.6 at 150px to 1.0 at 300px
            const minWidth = 150;
            const maxWidth = 300;
            const minScale = 0.6;
            const maxScale = 1.0;
            
            let scale;
            if (containerWidth <= minWidth) {
                scale = minScale;
            } else if (containerWidth >= maxWidth) {
                scale = maxScale;
            } else {
                // Linear interpolation between min and max
                const ratio = (containerWidth - minWidth) / (maxWidth - minWidth);
                scale = minScale + (ratio * (maxScale - minScale));
            }
            
            console.log(`Summary scaling: container=${containerWidth}px, scale=${scale}`);
    
            summaryParagraph.style.setProperty('--summary-scale', scale);
        }
    }
    
    // Add click event listeners to all summary thumbnails
    summaryThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const layoutType = this.getAttribute('data-layout');
            
            // Remove existing layout classes
            mediaLayout.classList.remove('layout-main-only', 'layout-with-thumbnails');
            
            // Remove active class from all thumbnails
            summaryThumbnails.forEach(thumb => thumb.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Add the new layout class
            mediaLayout.classList.add(`layout-${layoutType}`);
            
            console.log(`Switching to ${layoutType} layout - animation starting`);
            
            // Update scales after layout change and animation completes
            // Wait for the full animation duration (0.6s) plus a small buffer
            setTimeout(() => {
                updateTitleScale();
                updateSummaryScale();
                console.log(`${layoutType} layout animation completed`);
            }, 700);
        });
    });
    
    // Initialize with main-only layout (default) and set first thumbnail as active
    mediaLayout.classList.add('layout-main-only');
    const firstMainOnlyThumbnail = document.querySelector('.summary-thumbnail-1[data-layout="main-only"]');
    if (firstMainOnlyThumbnail) {
        firstMainOnlyThumbnail.classList.add('active');
    }
    
    // Initial scale calculation
    updateTitleScale();
    updateSummaryScale();
    // Update scale on window resize
    window.addEventListener('resize', () => {
        updateTitleScale();
        updateSummaryScale();
    });
});
