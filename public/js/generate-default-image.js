// This script can be run separately to generate a default character image
// It's for demonstration purposes only - in a real app you'd save this to the file system
function generateDefaultImage() {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#222222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw question mark
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', 50, 45);
    
    // Character text
    ctx.font = 'bold 14px Arial';
    ctx.fillText('CHARACTER', 50, 80);
    
    // Create a data URL from the canvas
    const imageURL = canvas.toDataURL('image/png');
    
    // Display the image (for testing)
    console.log("Default image generated. URL:");
    console.log(imageURL);
    
    // Create an image and add it to the page for easy saving
    const img = new Image();
    img.src = imageURL;
    img.style.border = '1px solid white';
    img.style.margin = '20px';
    img.title = 'Right-click and save this image as "default.png" in your characters folder';
    
    // Create a container for the image
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.background = '#333';
    container.style.padding = '10px';
    container.style.borderRadius = '5px';
    container.style.zIndex = '9999';
    
    // Add a heading
    const heading = document.createElement('h3');
    heading.textContent = 'Default Character Image';
    heading.style.color = 'white';
    heading.style.marginBottom = '10px';
    heading.style.fontSize = '14px';
    container.appendChild(heading);
    
    // Add instructions
    const instructions = document.createElement('p');
    instructions.textContent = 'Right-click and save this image as "default.png" in your img/characters/ folder';
    instructions.style.color = 'white';
    instructions.style.fontSize = '12px';
    instructions.style.marginBottom = '10px';
    container.appendChild(instructions);
    
    // Add the image
    container.appendChild(img);
    
    // Add a close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.display = 'block';
    closeButton.style.margin = '10px auto 0';
    closeButton.style.padding = '5px 10px';
    closeButton.style.background = '#f00';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '3px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = function() {
        document.body.removeChild(container);
    };
    container.appendChild(closeButton);
    
    // Add the container to the page
    document.body.appendChild(container);
    
    return imageURL;
}

// Run this when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Generate the default image
    setTimeout(generateDefaultImage, 2000);
}); 