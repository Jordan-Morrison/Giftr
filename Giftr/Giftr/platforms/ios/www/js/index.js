const app = {

    main: function(){
        app.addConstantEventListeners();
        app.addDynamicEventListeners();
    },

    //Constant listeners are mainly navigation buttons (always stay the same throughout session)
    addConstantEventListeners: function(){
        //People list to add person form
        document.querySelectorAll(".addPersonButton").forEach(element => {
            element.addEventListener("click", function(){
                app.navigate("peopleScreen", "peopleForm");
            })
        });

        //Add person form (cancelled) to people list 
        document.getElementById("peopleFormCancelButton").addEventListener("click",function(){
            app.navigate("peopleForm", "peopleScreen");
        });

        //Add person form (saved) to people list 
        document.getElementById("peopleFormSaveButton").addEventListener("click",function(){
            //Any extra action on saving data goes here
            app.navigate("peopleForm", "peopleScreen");
        });

        //Gift list to add new gift screen
        document.querySelectorAll(".addGiftButton").forEach(element => {
            element.addEventListener("click", function(){
                app.navigate("giftScreen", "giftForm");
            })
        });

        //Gift list back to people list
        document.getElementById("giftScreenBackButton").addEventListener("click", function(){
            app.navigate("giftScreen", "peopleScreen");
        });

        //Add gift form (cancelled) to gift list 
        document.getElementById("giftFormCancelButton").addEventListener("click", function(){
            app.navigate("giftForm", "giftScreen");
        });

        //Add gift form (saved) to gift list 
        document.getElementById("giftFormSaveButton").addEventListener("click", function(){
            //Any extra action on saving data goes here
            app.navigate("giftForm", "giftScreen");
        });
    },

    //Dynamic listeners are the list items which can change throughout the session
    addDynamicEventListeners: function(){
        document.querySelectorAll("#peopleList .list-item").forEach(element => {
            element.addEventListener("click", function(){
                //Update gift screen with data from server
                app.navigate("peopleScreen", "giftScreen");
            });
        });
    },

    //Simple navigation function to reduce code repetition
    navigate: function(hide, show){
        document.getElementById(hide).classList.remove("active");
        document.getElementById(show).classList.add("active");
    }

};

let loadEvent = ("deviceready" in document)?"deviceready":"DOMContentLoaded";
document.addEventListener(loadEvent, app.main);