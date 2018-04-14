const app = {

    init: function(){
        // Get buttons from the platform specific javascript file
        app.platformConstants.buttons.addPersonButton.addEventListener('click', app.nav);
        app.platformConstants.buttons.addGiftButton.addEventListener('click', app.nav);
    },

    nav: function(ev){
        // Following regular expressions allow for platform independent navigation
        let personButton = '/add-person-button-.*/';
        let giftButton = '/add-gift-button-.*/'
        switch (ev.target.id) {
            case personButton :
                document.getElementById('peopleForm').classList.add('active');
                document.getElementById('peopleScreen').classList.remove('active');
                break;
            case giftButton :
                document.getElementById('giftForm').classList.add('active');
                document.getElementById('giftScreen').classList.remove('active');
                break;
        }
    }

};

let loadEvent = ("deviceready" in document)?"deviceready":"DOMContentLoaded";
document.addEventListener(loadEvent, app.init);