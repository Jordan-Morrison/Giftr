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
        app.platformConstants.personAddAnimate();
    },

// Delay, scale-in and pulse the add person button on the person list page
    personAddAnimate: function() {
        setTimeout(() => {
            app.platformConstants.buttons.addPersonButton.parentElement.classList.add('scale-in');
        }, 800);
        app.platformConstants.buttons.addPersonButton.parentElement.classList.add('pulse');
        setTimeout(() => {
            app.platformConstants.buttons.addPersonButton.parentElement.classList.remove('pulse');
        }, 2000);
    },
// Animate add gift button on gift list page
    giftAddAnimate: function(){
        setTimeout(() => {
            app.platformConstants.buttons.addGiftButton.parentElement.classList.add('scale-in');
        }, 800);
        app.platformConstants.buttons.addGiftButton.parentElement.classList.add('pulse');
        setTimeout(() => {
            app.platformConstants.buttons.addGiftButton.parentElement.classList.remove('pulse');
        }, 1000);
    }
};

document.addEventListener(loadEvent, app.platformConstants.init);