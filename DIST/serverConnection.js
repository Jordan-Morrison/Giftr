const server = {

    init: function(baseURL, uuid){
        server.baseURL = baseURL;
        server.uuid = uuid;
        server.getToken();
    },

    getToken: async function(){
        if (localStorage.getItem("token")){
            server.token = localStorage.getItem("token");
        }
        else{
            try {
                let response = await server.connect(`users?device_id=${server.uuid}`, "GET", null, null);
                if (server.checkResponseCode(response.code, response.message)){
                    console.log("Token", response);
                    server.saveToken(response.data.token);
                }
                else{
                    server.registerUser();
                }
            } catch (e) {
                console.log("error" + e);
            }    
        }
    },

    registerUser: async function(){
        try {
            let response = await server.connect(`users`, "POST", null, `device_id=${server.uuid}`);
            console.log("Register User", response);
            server.saveToken(response.data.token);
            return response;
        } catch (e) {
            console.log("ERROR: " + e);
        }
    },

    getPeopleList: async function(){
        try {
            let data = await server.connect(`people`, "GET", server.token, null);
            console.log("People List", data);
            return data;
        } catch (e) {
            console.log("ERROR: " + e);
        }
    },

    getPerson: async function(personId){
        try {
            let response = await server.connect(`people.php/${personId}`, "GET", server.token, null);
            console.log("Get Person", response);
            return response;
        } catch (e) {
            console.log("ERROR: " + e);
        }
    },

    addPerson: async function(name, dateOfBirth){
        try {
            let response = await server.connect(`people`, "POST", server.token, `person_name=${name}&person_dob=${dateOfBirth}`);
            console.log("Add Person", response);
            return response;
        } catch (e) {
            console.log("ERROR: " + e);
        }
    },

    // editPerson: async function(personID, name, dateOfBirth){
    //     try {
    //         let response = await server.connect(`people.php/${personID}`, "PUT", server.token, `person_name=${name}&person_dob=${dateOfBirth}`);
    //         console.log("Edit Person", response);
    //         return response;
    //     } catch (e) {
    //         console.log("ERROR: " + e);
    //     }
    // },

    editPerson: async function(personId, name, dateOfBirth){
        try{
            let response = await server.connect(`people.php/${personId}`, "DELETE", server.token, null);
            console.log("Delete Person (editing)", response);
            try {
                response = await server.connect(`people`, "POST", server.token, `person_name=${name}&person_dob=${dateOfBirth}`);
                console.log("Add Person", response);
                return response;
            } catch (e) {
                console.log("ERROR: " + e);
            }
        } catch (e){
            console.log("ERROR: " + e);
        }
    },

    // editPerson: async function(personId, name, dateOfBirth){
    //     let gifts = await server.getGifts(personId);
    //     let response = await server.deletePerson(personId);
    //     let newPersonId = await server.addPerson(name, dateOfBirth);
    //     gifts.data.forEach (async gift => {
    //         response = await server.addGift(newPersonId, gift.gift_title, gift.gift_url, gift.gift_price, gift.gift_store)
    //     });
    // },

    deletePerson: async function(personID){
        try {
            let response = await server.connect(`people.php/${personID}`, "DELETE", server.token, null);
            console.log("Delete Person", response);
            return response;
        } catch (e) {
            console.log("ERROR: " + e);
        }
    },

    getGifts: async function(personID){
        try {
            let response = await server.connect(`gifts?person_id=${personID}`, "GET", server.token, null);
            console.log("Get Gifts", response);
            return response;
        } catch (e) {
            console.log("ERROR: " + e);
        }
    },

    addGift: async function(personId, gift, url, price, store){
        try {
            let response = await server.connect(`gifts`, "POST", server.token, `person_id=${personId}&gift_title=${gift}&gift_url=${url}&gift_price=${price}&gift_store=${store}`);
            console.log("Add Gift", response);
            return response;
        } catch (e) {
            console.log("ERROR: " + e);
        }
    },

    deleteGift: async function(giftId){
        try {
            let response = await server.connect(`gifts.php/${giftId}`, "DELETE", server.token, null);
            console.log("Delete Gift", response);
            return response;
        } catch (e) {
            console.log("ERROR: " + e);
        }
    },

    connect: async function(resource, method, token, parameters){
        let options = {
            "method": method
        };
        if (token){
            options.headers = {
                "X-Api-Key": token
                // "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            };
        }
        if (parameters){
            if (!options.headers){
                options.headers = {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                };
            }
            else{
                options.headers["Content-type"] = "application/x-www-form-urlencoded; charset=UTF-8";
            }
            options.body = parameters;
        }
        // await response of fetch call
        console.log(`${server.baseURL}/${resource}`, options);
        let response = await fetch(`${server.baseURL}/${resource}`, options);
        // only proceed once promise is resolved
        let data = await response.json();
        // only proceed once second promise is resolved
        return data;
    },

    saveToken: function(token){
        server.token = token;
        localStorage.setItem("token", token);
    },

    checkResponseCode: function(code, message){
        switch (code) {
            case 200:
                return true;
            case 201:
                return true;
            case 202:
                return true;
            case 400:
                return false;
            case 401:
                return false;
            case 403:
                return false;
            case 404:
                return false;
            case 405:
                return false;
            case 500:  
                return false;
        }
    }

};

// server.connect("users?device_id=123456789", "GET", null, null);
// server.connect("people", "POST", "a9fa47e945766d1631247a8f7dbf9db35c56057e", "person_name=Bob&person_dob=2000-01-01");

// connect: async function(resource, method, token, parameters, func){
//     let options = {
//         "method": method
//     };
//     if (token){
//         options.headers = {
//             "X-Api-Key": token
//         };
//     }
//     if (parameters){
//         options.headers["Content-type"] = "application/x-www-form-urlencoded; charset=UTF-8";
//         options.body = parameters; //person_name=Bob&person_dob=12-12-2111
//     }
//     fetch(`${server.baseURL}/${resource}`, options)
//     .then(result=>result.json())
//     .then((data)=>{
//         console.log(data);
//         func(data.data.token);
//         return data;
//     })
//     .catch(function(err){
//         console.log("Failed to fetch");
//     });
// },

// setOptions: function(method, token, parameters){
//     console.log(token);
//     let options = {
//         "method": method
//     };
//     if (token){
//         options.headers = {};
//         options.headers["X-Api-Key"] = token;
//     }
//     if (parameters){
//         options.body = parameters;
//         options.headers["Content-type"] = "application/x-www-form-urlencoded; charset=UTF-8";
//     }
//     console.log("test");
//     console.log(options);
//     return options;
// },

    // getToken: function(){
    //     if (localStorage.getItem("token")){
    //         server.token = localStorage.getItem("token");
    //     }
    //     else{
    //         let response = server.connect(`users?device_id=${server.uuid}`, "GET", null, null);
    //         setTimeout(() => {
    //             console.log(response);
    //             if (server.checkResponseCode(response.code, response.message)){
    //                 server.token = response.data.token;
    //                 localStorage.setItem("token", server.token);
    //             }
    //             else{
    //                 response = server.connect("users", "POST", null, `device_id=${server.uuid}`);
    //             }
    //         }, 10000);
            
    //     }
    // },