const app = {

    init: function(){
        // Get buttons from the platform specific javascript file and add navigation event listener
        app.platformConstants.buttons.addPersonButton.addEventListener('click', app.nav);
        app.platformConstants.buttons.addGiftButton.addEventListener('click', app.nav);
        app.platformConstants.buttons.giftListBackButton.addEventListener('click', app.nav);
        document.getElementById('add-gift-cancel-button').addEventListener('click', app.nav);
        document.getElementById('add-person-cancel-button').addEventListener('click', app.nav);        
        // Add event listener to each person on page, temporary as ideally this will be a run of the list checking->building function
        // with each item given a listener
        Array.from(document.getElementsByClassName('list-item person')).forEach(element => {
            element.addEventListener('click', app.nav);
        });
    },

    nav: function(ev){
        console.log(ev.target.id);
        // Following regular expressions allow for platform independent navigation for example, button could be either add-person-button-android
        // or add-person-button-ios and you would see the same behaviour
        let addPersonButton = new RegExp('add-person-button-.*');
        let addGiftButton = new RegExp('add-gift-button-.*');
        let giftListBackButton = new RegExp('gift-back-button-.*');
        switch (true) {
            case addPersonButton.test(ev.target.id) :
                document.getElementById('peopleForm').classList.add('active');
                document.getElementById('peopleScreen').classList.remove('active');
                break;
            case ev.target.id === 'add-person-cancel-button' :
                document.getElementById('peopleScreen').classList.add('active');
                document.getElementById('peopleForm').classList.remove('active');
                break;
            case ev.target.id === 'add-gift-cancel-button' :
                document.getElementById('giftScreen').classList.add('active');
                document.getElementById('giftForm').classList.remove('active');
                break;
            case addGiftButton.test(ev.target.id) :
                document.getElementById('giftForm').classList.add('active');
                document.getElementById('giftScreen').classList.remove('active');
                break;
            case giftListBackButton.test(ev.target.id) :
                document.getElementById('peopleScreen').classList.add('active');
                document.getElementById('giftScreen').classList.remove('active');
                break;
            case ev.target.offsetParent.className == 'list-item person' || ev.target.className == 'list-item person' :
                document.getElementById('giftScreen').classList.add('active');
                document.getElementById('peopleScreen').classList.remove('active');
                // Function that builds the list of gifts for the chosen person would go here
        }
    }

};

let loadEvent = ("deviceready" in document)?"deviceready":"DOMContentLoaded";
document.addEventListener(loadEvent, app.init);