const app = {

    main: function(){
        alert("alerts are working");
        app.addConstantEventListeners();
        // server.init("http://localhost/giftr_api-master/giftr/api", "123456789");
        server.init("https://dall0078.edumedia.ca/mad9023/giftr/api", "123456789");
        app.generatePeopleList();
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
            app.clearPeopleForm();
            app.navigate("peopleForm", "peopleScreen");
        });

        //Add person form (saved) to people list 
        document.getElementById("peopleFormSaveButton").addEventListener("click", async function(){
            //Any extra action on saving data goes here
            if (this.getAttribute("data-id") == ""){
                await server.addPerson(document.getElementById("name").value, document.getElementById("birthday").value);
            }
            else{
                await server.editPerson(this.getAttribute("data-id"), document.getElementById("name").value, document.getElementById("birthday").value);
            }
            app.clearPeopleForm();
            app.generatePeopleList();
            app.navigate("peopleForm", "peopleScreen");
        });

        //Gift list to add new gift screen
        document.querySelectorAll(".addGiftButton").forEach(element => {
            element.addEventListener("click", function(){
                app.navigate("giftScreen", "giftForm");
            })
        });

        //Gift list back to people list
        document.querySelectorAll(".giftScreenBackButton").forEach(element => {
            element.addEventListener("click", function(){
                app.navigate("giftScreen", "peopleScreen");
            })
        });

        //Add gift form (cancelled) to gift list 
        document.getElementById("giftFormCancelButton").addEventListener("click", function(){
            app.clearGiftForm();
            app.navigate("giftForm", "giftScreen");
        });

        //Add gift form (saved) to gift list 
        document.getElementById("giftFormSaveButton").addEventListener("click", async function(){
            //Any extra action on saving data goes here
            await server.addGift(document.getElementById("giftScreen").getAttribute("data-id"), document.getElementById("giftIdea").value, document.getElementById("giftUrl").value, document.getElementById("giftPrice").value, document.getElementById("giftStore").value);
            app.generateGiftList();
            app.clearGiftForm();
            app.navigate("giftForm", "giftScreen");
        });
    },

    //Dynamic listeners are the list items which can change throughout the session
    addPeopleEventListeners: function(){
        document.querySelectorAll("#peopleList .list-item .arrow_right").forEach(element => {
            element.addEventListener("click", function(){
                //Update gift screen with data from server
                app.generateGiftList(this.parentElement.getAttribute("data-id"));
                document.getElementById("giftScreen").setAttribute("data-id", this.parentElement.getAttribute("data-id"));
                app.navigate("peopleScreen", "giftScreen");
                // If platform is Android, add animations
                if(app.platformConstants.platform === 'Android'){
                    app.platformConstants.giftAddAnimate();
                }
            });
        });

        document.querySelectorAll("#peopleList .list-item .peopleListName").forEach(element => {
            element.addEventListener("click", function(){
                //Update people form screen
                app.autoFillPeopleForm(this.parentElement.getAttribute("data-id"));
                document.getElementById("peopleFormSaveButton").setAttribute("data-id", this.parentElement.getAttribute("data-id"));

                app.navigate("peopleScreen", "peopleForm");
                // If platform is Android, add animations
                if(app.platformConstants.platform === 'Android'){
                    app.platformConstants.giftAddAnimate();
                }
            });
        });
    },

    addGiftEventListeners: async function(){
        document.querySelectorAll("#giftList .list-item .delete").forEach(element => {
            element.addEventListener("click", async function(){
                await server.deleteGift(this.getAttribute("data-giftid"));
                this.parentElement.remove();
            });
        });
    },

    //Simple navigation function to reduce code repetition
    navigate: function(hide, show){
        document.getElementById(hide).classList.remove("active");
        document.getElementById(show).classList.add("active");
    },

    clearPeopleForm: function(){
        document.getElementById("peopleFormSaveButton").setAttribute("data-id", "");
        document.getElementById("name").value = "";
        document.getElementById("birthday").value = "";
    },

    clearGiftForm: function(){
        document.getElementById("giftIdea").value = "";
        document.getElementById("giftPrice").value = "";
        document.getElementById("giftStore").value = "";
        document.getElementById("giftUrl").value = "";
    },

    generatePeopleList: async function(){
        let response = await server.getPeopleList();
        let output = "";
        response.data.forEach(person => {
            output += `<li class="list-item" data-id="${person.person_id}"><img src="img/avatar.png" alt="avatar icon" class="avatar" /><span class="action-right icon arrow_right"></span><p class="peopleListName">${person.person_name}</p><p>${person.person_dob}</p></li>`;
        });
        document.getElementById("peopleList").innerHTML = output;
        app.addPeopleEventListeners();
    },

    autoFillPeopleForm: async function(personID){
        let response = await server.getPerson(personID);
        document.getElementById("name").value = response.data.person_name;
        document.getElementById("birthday").value = response.data.person_dob;
    },

    generateGiftList: async function(personID){
        let output = "";
        try{
            let response = await server.getGifts(personID);
            response.data.forEach(gift => {
                output += `<li class="list-item"><img src="img/gift.png" alt="gift icon" class="avatar" /><span class="action-right icon delete" data-giftid="${gift.gift_id}"></span><p>${gift.gift_title}</p><p>${gift.gift_price}</p></li>`;
            });
        } 
        catch(e){
            output = `<li class="list-item"></span><p>No gifts found!</p><p>Add a gift now!</p></li>`;
        }
        document.getElementById("giftList").innerHTML = output;
        app.addGiftEventListeners();
    },

};

let loadEvent = ("deviceready" in document)?"deviceready":"DOMContentLoaded";
document.addEventListener(loadEvent, app.main);