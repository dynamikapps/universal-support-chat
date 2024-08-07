(function() {
  // Create container for the app
  const container = document.createElement('div');
  container.id = 'universal-support-chat-container';
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.right = '20px';
  container.style.zIndex = '9999';
  document.body.appendChild(container);

  // Create and inject the app's iframe
  const iframe = document.createElement('iframe');
  iframe.src = chrome.runtime.getURL('index.html');
  iframe.style.border = 'none';
  iframe.style.width = '350px';
  iframe.style.height = '500px';
  iframe.style.borderRadius = '8px';
  iframe.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  container.appendChild(iframe);

  // Make the container draggable
  let isDragging = false;
  let dragOffsetX, dragOffsetY;

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragOffsetX = e.clientX - container.offsetLeft;
    dragOffsetY = e.clientY - container.offsetTop;
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const left = e.clientX - dragOffsetX;
      const top = e.clientY - dragOffsetY;
      container.style.left = `${left}px`;
      container.style.top = `${top}px`;
      container.style.right = 'auto';
      container.style.bottom = 'auto';
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Handle messages from the React app
  window.addEventListener('message', (event) => {
    if (event.data.type === 'RESIZE_CHAT') {
      iframe.style.width = event.data.width;
      iframe.style.height = event.data.height;
    }
  });
})();