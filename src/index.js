const Toasteur = class {
  constructor(position = 'top-right', fadeOutTimeout = 3000, notificationPosition = 'bottom', allowHtml = false) {
    // If notificationPosition is set to 'top' (of the notification pile)
    // Set notificationOnTop to true
    let notificationOnTop = notificationPosition === 'top';
    this.fadeOutTimeout = fadeOutTimeout;
    this.initialized = false;
    this.init = () => {
      // If a notification container already exists, use it
      if (document.querySelector('.toasteur-container.' + position)) {
        this.container = document.querySelector('.toasteur-container.' + position);
        this.initialized = true;
        return;
      }
      // Otherwise, create a new container
      this.container = document.createElement('div');
      this.container.classList.add('toasteur-container');
      this.container.classList.add(position);

      document.body.appendChild(this.container);
      this.initialized = true;
    }

    // If the notification container position is not :
    // - top-right
    // - bottom-right
    // - bottom-left
    // - top-left
    // - top-center
    // - bottom-center
    // Throw an error
    if (![ 'top-center', 'bottom-center', 'top-right', 'top-left', 'bottom-right', 'bottom-left' ].includes(position))
      throw new Error('Invalid position, expected one of: top-right, top-left, bottom-right, bottom-left');

    // This function shows a notification with the specified type
    this.show = (type, message, title = '', clickCallback) => {
      // If the notification container is not initialized, initialize it
      if (!this.initialized)
        this.init();

      // The notification itself
      let notificationElement = document.createElement('div');
      notificationElement.classList.add('toasteur-notification');
      notificationElement.classList.add(type);

      // The content of the notification
      let contentElement = document.createElement('p');
      contentElement.classList.add('toasteur-content');
      if (allowHtml)
        contentElement.innerHTML = message;
      else
        contentElement.innerText = message;

      // The title of the notification
      let titleElement = document.createElement('p');
      titleElement.classList.add('toasteur-title');

      titleElement.innerText = title;

      // The container for the title and the content
      let textContainer = document.createElement('div');
      textContainer.classList.add('toasteur-text-container');
      textContainer.appendChild(titleElement)
      textContainer.appendChild(contentElement);

      notificationElement.appendChild(textContainer);

      // When the notification is clicked, call the callback if any
      // And remove the notification
      notificationElement.onclick = () => {
        if (clickCallback)
          clickCallback();

        notificationElement.remove();
      }

      let timeouts = [];
      // When the mouse leaves the notification
      notificationElement.onmouseout = () => {
        // Add a fadout class to the notification after the fadeOutTimeout
        // Add the timeout to the timeouts array
        timeouts.push(setTimeout(() => {
          notificationElement.classList.add('toasteur-notification-fadout');
          // Remove the notification from the dom after 1.3 seconds
          timeouts.push(setTimeout(() => {
            notificationElement.remove();
          }, 1300));
        }, this.fadeOutTimeout))
      }

      // When the mouse is on the notification
      notificationElement.onmousemove = () => {
          // Remove all current timeouts
        timeouts.forEach(timeout => clearTimeout(timeout))
        timeouts = [];
          // Remove the fadout class from the notification
        notificationElement.classList.remove('toasteur-notification-fadout');
      }
        // Start to fade out the notification
      notificationElement.onmouseout()
        // If the notification is set to be on the top of the pile
        // Add the notification as the first child of the notification container
        // Else add the notification as the last one
      notificationOnTop ?
        this.container.prepend(notificationElement) :
        this.container.appendChild(notificationElement)
    }

    // Shortcut for Toasteur.show('error', ...)
    this.error = (message, title, clickCallback) =>
      this.show('error', message, title, clickCallback);


    // Shortcut for Toasteur.show('success', ...)
    this.success = (message, title, clickCallback) =>
      this.show('success', message, title, clickCallback);


    // Shortcut for Toasteur.show('info', ...)
    this.info = (message, title, clickCallback) =>
      this.show('info', message, title, clickCallback);

    // Shortcut for Toasteur.show('warn', ...)
    this.warn = (message, title, clickCallback) =>
      this.show('warn', message, title, clickCallback);

  }
}

// If imported as a module, export the class
if (typeof module !== 'undefined') {
  module.exports = Toasteur;
}
