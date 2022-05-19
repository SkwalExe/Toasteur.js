const Toasteur = class {
  constructor(position = 'top-right', fadeOutTimeout = 3000) {
    this.fadeOutTimeout = fadeOutTimeout;
    this.initialized = false;
    this.init = () => {
      if (document.querySelector('.toasteur-container.' + position)) {
        this.container = document.querySelector('.toasteur-container.' + position);
        this.initialized = true;
        return;
      }
      this.container = document.createElement('div');
      this.container.classList.add('toasteur-container');
      this.container.classList.add(position);

      document.body.appendChild(this.container);
      this.initialized = true;
    }
    if (![ 'top-right', 'top-left', 'bottom-right', 'bottom-left' ].includes(position))
      throw new Error('Invalid position, expected one of: top-right, top-left, bottom-right, bottom-left');


    this.show = (type, message, title, clickCallback) => {
      if (!this.initialized)
        this.init();

      let notificationElement = document.createElement('div');
      notificationElement.classList.add('toasteur-notification');
      notificationElement.classList.add(type);

      let contentElement = document.createElement('p');
      contentElement.classList.add('toasteur-content');
      contentElement.innerText = message;

      let titleElement = document.createElement('p');
      titleElement.classList.add('toasteur-title');
      titleElement.innerText = title;


      let textContainer = document.createElement('div');
      textContainer.classList.add('toasteur-text-container');
      textContainer.appendChild(titleElement)
      textContainer.appendChild(contentElement);

      notificationElement.appendChild(textContainer);

      notificationElement.onclick = () => {
        if (clickCallback)
          clickCallback();

        notificationElement.remove();
      }

      let timeouts = [];
      notificationElement.onmouseout = () => {
        timeouts.push(setTimeout(() => {
          notificationElement.classList.add('toasteur-notification-fadout');
          timeouts.push(setTimeout(() => {
            notificationElement.remove();
          }, 1300));
        }, this.fadeOutTimeout))
      }
      notificationElement.onmousemove = () => {
        timeouts.forEach(timeout => clearTimeout(timeout))
        timeouts = [];
        notificationElement.classList.remove('toasteur-notification-fadout');
      }

      notificationElement.onmouseout()

      this.container.appendChild(notificationElement);
    }

    this.error = (message, title, clickCallback) => {
      this.show('error', message, title, clickCallback);
    }

    this.success = (message, title, clickCallback) => {

      this.show('success', message, title, clickCallback);
    }

    this.info = (message, title, clickCallback) => {
      this.show('info', message, title, clickCallback);
    }

    this.warn = (message, title, clickCallback) => {
      this.show('warn', message, title, clickCallback);
    }
  }
}

if (typeof module !== 'undefined') {
  module.exports = Toasteur;
}
