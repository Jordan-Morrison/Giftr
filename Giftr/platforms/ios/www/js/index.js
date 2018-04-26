const app = {

    main: function(){setTimeout(() => {
        app.addConstantEventListeners();
        server.init("https://dall0078.edumedia.ca/mad9023/giftr/api", device.uuid);
        app.generatePeopleList();
    }, 200);
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
            if(document.getElementById('peopleFormSaveButton').getAttribute('data-id') !== ""){
                document.getElementById('peopleFormSaveButton').getAttribute('data-id') == ""
            }
            app.clearPeopleForm();
            app.navigate("peopleForm", "peopleScreen");
            document.getElementById("peopleFormTitle").innerHTML = "Add Person";
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
            document.getElementById("peopleFormTitle").innerHTML = "Add Person";
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
            let personId = document.getElementById("giftScreen").getAttribute("data-id");
            await server.addGift(personId, document.getElementById("giftIdea").value, document.getElementById("giftUrl").value, document.getElementById("giftPrice").value, document.getElementById("giftStore").value);
            // output += `<li class="list-item"><img src="img/gift.png" alt="gift icon" class="avatar" /><span class="action-right icon delete" data-giftid="${gift.gift_id}"></span><p>${document.getElementById("giftIdea").value}</p><p>${document.getElementById("giftPrice").value}</p></li>`;
            app.navigate("giftForm", "giftScreen");
            app.generateGiftList(personId);
            app.clearGiftForm();
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
                let dataId = this.parentElement.getAttribute("data-id");
                console.log(dataId);
                app.autoFillPeopleForm(dataId);
                document.getElementById("peopleFormSaveButton").setAttribute("data-id", dataId);
                // Change page title to match edit context
                document.getElementById("peopleFormTitle").innerHTML = "Edit Person";
                let deletePersonButton = document.createElement("span");
                deletePersonButton.classList.add("action-right", "icon", "delete");
                deletePersonButton.setAttribute("id", "deletePersonButton");
                deletePersonButton.setAttribute("data-id", dataId);
                document.getElementById("peopleFormHeader").appendChild(deletePersonButton);
                deletePersonButton.addEventListener("click", function(){
                    server.deletePerson(dataId);
                    app.navigate("peopleForm", "peopleScreen");
                    app.clearPeopleForm();
                    app.generatePeopleList();
                });
                app.navigate("peopleScreen", "peopleForm");
            });
        });
    },

    addGiftEventListeners: async function(){
        console.log(document.querySelectorAll(".gift-url"));
        document.querySelectorAll(".gift-url").forEach(element =>{
            console.log(element.innerHTML);
            element.addEventListener("click", app.openGiftLink);
        })
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

    openGiftLink: function(ev){
        cordova.InAppBrowser.open(ev.target.innerHTML, '_blank', 'location=yes');
    },

    clearPeopleForm: function(){
        document.getElementById("peopleFormSaveButton").setAttribute("data-id", "");
        document.getElementById("name").value = "";
        document.getElementById("birthday").value = "";
        document.getElementById("peopleForm")
        let deletePersonButton = document.getElementById("deletePersonButton");
        if(deletePersonButton){
            deletePersonButton.remove();
        }
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
        document.getElementById("peopleList").innerHTML = output;
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
                output += `<li class="list-item"><img src="img/gift.png" alt="gift icon" class="avatar" /><span class="action-right icon delete" data-giftid="${gift.gift_id}"></span><p>${gift.gift_title}</p><p>${gift.gift_price}</p><p class="gift-url">${gift.gift_url}</p></li>`;
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