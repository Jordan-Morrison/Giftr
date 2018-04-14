const app = {

    init: function(){
        // Get buttons from the platform specific javascript file and add navigation event listener
        app.platformConstants.buttons.addPersonButton.addEventListener('click', app.nav);
        app.platformConstants.buttons.addGiftButton.addEventListener('click', app.nav);
        // Add event listener to each person on page
        document.getElementById('person-list').addEventListener('click', app.nav);
    },

    nav: function(ev){
        console.log(ev.target.nodeName);
        // Following regular expressions allow for platform independent navigation for example, button could be either add-person-button-android
        // or add-person-button-ios and you would see the same behaviour
        let personButton = new RegExp('add-person-button-.*');
        let giftButton = new RegExp('add-gift-button-.*');
        switch (true) {
            case personButton.test(ev.target.id) :
                document.getElementById('peopleForm').classList.add('active');
                document.getElementById('peopleScreen').classList.remove('active');
                break;
            case giftButton.test(ev.target.id) :
                document.getElementById('giftForm').classList.add('active');
                document.getElementById('giftScreen').classList.remove('active');
                break;
            case ev.target.nodeName == 'LI' :
                document.getElementById('giftScreen').classList.add('active');
                document.getElementById('peopleScreen').classList.remove('active');
                // Function that builds the list of gifts for the chosen person would go here
        }
    }

};

let loadEvent = ("deviceready" in document)?"deviceready":"DOMContentLoaded";
document.addEventListener(loadEvent, app.init);