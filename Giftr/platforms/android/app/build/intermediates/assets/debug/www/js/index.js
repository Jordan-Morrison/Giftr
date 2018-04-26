const app = {

    main: function(){
        app.editFlag = [false, null];
        app.checkLocalStorage();
        app.addConstantEventListeners();
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
            app.navigate("peopleForm", "peopleScreen");
            document.getElementById("addPeopleForm").reset();
            app.editFlag[0] = false;
            document.getElementById("peopleFormTitle").innerHTML = "Add Person";
        });

        //Add person form (saved) to people list 
        document.getElementById("peopleFormSaveButton").addEventListener("click", function(){
            //Any extra action on saving data goes here
            if (app.validatePersonForm(document.getElementById("name").value, document.getElementById("birthday").value)){
                if (app.editFlag[0]){
                    app.editPerson(document.getElementById("name").value, document.getElementById("birthday").value);
                }
                else{
                    app.addPerson(document.getElementById("name").value, document.getElementById("birthday").value);
                }
                app.navigate("peopleForm", "peopleScreen");
                document.getElementById("addPeopleForm").reset();
                app.editFlag[0] = false;
                document.getElementById("peopleFormTitle").innerHTML = "Add Person";
            }
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
            document.getElementById("addGiftForm").reset();
            app.navigate("giftForm", "giftScreen");
        });

        //Add gift form (saved) to gift list 
        document.getElementById("giftFormSaveButton").addEventListener("click", function(){
            //Any extra action on saving data goes here
            if (app.validateGiftForm(document.getElementById("giftIdea").value, document.getElementById("giftPrice").value, document.getElementById("giftStore").value, document.getElementById("giftUrl").value)){
                app.addGift(document.getElementById("giftIdea").value, document.getElementById("giftPrice").value, document.getElementById("giftStore").value, document.getElementById("giftUrl").value.toLowerCase());
                document.getElementById("addGiftForm").reset();
                app.navigate("giftForm", "giftScreen");
            }
        });
    },

    //Dynamic listeners are the list items which can change throughout the session
    addPeopleEventListeners: function(){
        document.querySelectorAll("#peopleList .list-item .arrow_right").forEach(element => {
            element.addEventListener("click", function(){
                //Update gift screen with data from server
                document.getElementById("giftList").setAttribute("data-personid", this.parentElement.getAttribute("data-id"))
                app.generateGiftList(this.parentElement.getAttribute("data-id"));
                document.querySelectorAll("#peopleList .list-item").forEach(element => {
                    element.classList.remove("slideLeft");
                });
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
                // Change page title to match edit context
                document.getElementById("peopleFormTitle").innerHTML = "Edit Person";
                app.navigate("peopleScreen", "peopleForm");
            });
        });

        let target = document.querySelectorAll("#peopleList .swipeable");
        let tiny = new t$(target);
        tiny.addEventListener(t$.EventTypes.SWIPELEFT, onSwipeLeft);
        function onSwipeLeft(ev){
            document.querySelectorAll("#peopleList .swipeable").forEach(element => {
                element.classList.remove("slideLeft");
            });
            ev.target.classList.add("slideLeft");
            document.getElementById("deleteToggle").style.top = `${ev.target.offsetTop}px`;
            document.getElementById("deleteToggle").addEventListener("click", function(){
                app.deletePerson(ev.target.getAttribute("data-id"));
                document.getElementById("deleteToggle").style.top = `-100px`;
            });
        }
        tiny.addEventListener(t$.EventTypes.SWIPERIGHT, onSwipeRight);
        function onSwipeRight(ev){
            ev.target.classList.remove("slideLeft");
        }
    },

    addGiftEventListeners: function(){
        document.querySelectorAll("#giftList .list-item .delete").forEach(element => {
            element.addEventListener("click", function(){
                app.deleteGift(this.getAttribute("data-giftid"));
            });
        });

        document.querySelectorAll("#giftList .list-item .avatar").forEach(element => {
            element.addEventListener("click", function(){
                window.open(this.getAttribute("data-link"), '_system');
            });
        });
    },

    //Simple navigation function to reduce code repetition
    navigate: function(hide, show){
        document.getElementById(hide).classList.remove("active");
        document.getElementById(show).classList.add("active");
    },

    checkLocalStorage: function(){
        if (!localStorage.people){
            localStorage.people = JSON.stringify([]);
        }
    },

    validatePersonForm: function(name, dateOfBirth){
        if (name.replace(/\s/g, '') == ""){
            alert("You must enter a name");
            return false;
        }
        if (new Date(dateOfBirth) == "Invalid Date"){
            alert("The date you have entered is invalid");
            return false;
        }
        if(new Date() < new Date(dateOfBirth)){
            alert("Birth dates must be a past date");
            return false;
        }
        return true;
    },

    validateGiftForm: function(name, price, store, url){
        if (name.replace(/\s/g, '') == ""){
            alert("You must enter a gift idea");
            return false;
        }
        let validPrice = /^[0-9]\d*(?:\.\d{0,2})?$/;
        if (!validPrice.test(price)){
            alert("You must enter a valid price");
            return false;
        }
        if (store.replace(/\s/g, '') == ""){
            alert("You must enter a store name");
            return false;
        }
        let validUrl = /^(http|https):\/\/[^ "]+$/;
        if (!validUrl.test(url.toLowerCase())){
            alert("You must enter a valid URL");
            return false;
        }
        return true;
    },

    addPerson: function(name, dateOfBirth){
        let people = JSON.parse(localStorage.people);
        people.push({
            "name": name,
            "dateOfBirth": dateOfBirth,
            "gifts": [],
            "id": new Date().getTime()
        });
        localStorage.people = JSON.stringify(people);
        app.generatePeopleList();
    },

    deletePerson: function(personID){
        let people = JSON.parse(localStorage.people);
        people.forEach(person => {
            if (person.id == personID){
                people.splice(people.indexOf(person), 1);
                console.log("deleting perosn");
            }
        });
        localStorage.people = JSON.stringify(people);
        app.generatePeopleList();
    },

    autoFillPeopleForm: function(personID){
        let people = JSON.parse(localStorage.people);
        let personToEdit = null;
        people.forEach(person => {
            if (person.id == personID){
                personToEdit = person;
            }
        });
        app.editFlag = [true, personToEdit.id];
        document.getElementById("name").value = personToEdit.name;
        document.getElementById("birthday").value = personToEdit.dateOfBirth;
    },

    editPerson: function(name, dateOfBirth){
        let people = JSON.parse(localStorage.people);
        people.forEach(person => {
            if (person.id == app.editFlag[1]){
                person.name = name;
                person.dateOfBirth = dateOfBirth;
            }
        });
        localStorage.people = JSON.stringify(people);
        app.generatePeopleList();
    },

    addGift: function(name, price, store, url){
        let people = JSON.parse(localStorage.people);
        people.forEach(person => {
            if (person.id == document.getElementById("giftList").getAttribute("data-personid")){
                person.gifts.push({
                    "name": name,
                    "price": price,
                    "store": store,
                    "url": url,
                    "id": new Date().getTime()
                });
            }
        });
        localStorage.people = JSON.stringify(people);
        app.generateGiftList(document.getElementById("giftList").getAttribute("data-personid"));
    },

    deleteGift: function(giftID){
        let people = JSON.parse(localStorage.people);
        people.forEach(person => {
            if (person.id == document.getElementById("giftList").getAttribute("data-personid")){
                person.gifts.forEach(gift => {
                    if (gift.id == giftID){
                        person.gifts.splice(person.gifts.indexOf(gift), 1);
                    }
                });
            }
        });
        localStorage.people = JSON.stringify(people);
        app.generateGiftList(document.getElementById("giftList").getAttribute("data-personid"));
    },

    generatePeopleList: function(){
        let people = JSON.parse(localStorage.people);
        let output = "";
        if (people.length > 0){
            let sortedMonths = [[],[],[],[],[],[],[],[],[],[],[],[]];
            people.forEach(person => {
                sortedMonths[new Date(person.dateOfBirth).getMonth()].push(person);
            });
            let today = new Date();
            let month = null;
            let day = null;
            sortedMonths.forEach(month => {
                month.forEach(person => {
                    if (today > new Date(today.getFullYear(), new Date(person.dateOfBirth).getMonth(), new Date(person.dateOfBirth).getDate())){
                        output += `<li class="list-item passedDate swipeable" data-id="${person.id}"><img src="img/avatar.png" alt="avatar icon" class="avatar" /><span class="action-right icon arrow_right"></span><p class="peopleListName">${person.name}</p><p>${person.dateOfBirth}</p></li>`;
                    }
                    else{
                        output += `<li class="list-item upcomingDate swipeable" data-id="${person.id}"><img src="img/avatar.png" alt="avatar icon" class="avatar" /><span class="action-right icon arrow_right"></span><p class="peopleListName">${person.name}</p><p>${person.dateOfBirth}</p></li>`;
                    }
                    document.getElementById("deleteToggle").classList.remove("displayNone");
                });
            });
        }
        else{
            output = `<li class="list-item"></span><p>No people found!</p><p>Add a person now!</p></li>`;
            document.getElementById("deleteToggle").classList.add("displayNone");
        }
        document.getElementById("peopleList").innerHTML = output;
        app.addPeopleEventListeners();
    },

    generateGiftList: function(personID){
        let people = JSON.parse(localStorage.people);
        let selectedPerson = null;
        people.forEach(person => {
            if (person.id == personID){
                selectedPerson = person;
            }
        });
        let output = "";
        if (selectedPerson.gifts.length > 0){
            selectedPerson.gifts.forEach(gift => {
                output += `<li class="list-item"><img src="img/gift.png" alt="gift icon" class="avatar" data-link="${gift.url}"/><span class="action-right icon delete" data-giftid="${gift.id}"></span><p>${gift.name}</p><p>${gift.price}</p></li>`;
            });
        }
        else{
            output = `<li class="list-item"></span><p>No gifts found!</p><p>Add a gift now!</p></li>`;
        }
        document.getElementById("giftList").innerHTML = output;
        app.addGiftEventListeners();
    },

};

let loadEvent = ("deviceready" in document)?"deviceready":"DOMContentLoaded";
document.addEventListener(loadEvent, app.main);