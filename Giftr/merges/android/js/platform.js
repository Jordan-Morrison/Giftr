app.platformConstants = {
    platform: "Android",

    buttons: {
        addPersonButton: document.getElementById('add-person-button-android'),
        addGiftButton: document.getElementById('add-gift-button-android'),
        giftListBackButton: document.getElementById('gift-back-button-android')
    },

    // Perform initial platform-specific actions
    init: function(){
        // Scale-in add person button on home screen first time app is opened, and add pulse to get user attention
        setTimeout(() => {
            app.platformConstants.buttons.addPersonButton.parentElement.classList.add('scale-in');
        }, 800);
        app.platformConstants.buttons.addPersonButton.parentElement.classList.add('pulse');
        setTimeout(() => {
            app.platformConstants.buttons.addPersonButton.parentElement.classList.remove('pulse');
        }, 2000);
    }
};

document.addEventListener(loadEvent, app.platformConstants.init);