# Server Connection Calls

## Installation
To install the file grab **serverConnection.js** from Dist and reference it in your **index.html**.

We then need to initialize the the script in our **index.js**. Run the following when the app is loaded:
```javascript
server.init("SERVER BASEURL", "CORDOVA DEVICE UUID");
// Example: server.init("http://localhost/giftr_api-master/giftr/api", device.uuid);
```
*server.init will also retrieve/create a token for the user and store it in localstorage for later use.*
## People Functions

### Get a list of all people for the current user
```javascript
server.getPeopleList();
// Will return a JSON object such as:
{
  "code": 200,
  "data": [
    {
      "person_id": 27,
      "user_id": 3,
      "person_dob": "1990-03-06",
      "person_name": "Leroy Jenkins"
    },
    {
      "person_id": 32,
      "user_id": 3,
      "person_dob": "1990-02-05",
      "person_name": "Darth Vader"
    },
    {
      "person_id": 33,
      "user_id": 3,
      "person_dob": "1963-02-07",
      "person_name": "Johnny Rockets"
    }
  ],
  "message": "All people retrieved"
}
```
### Get a given person for the current user
```javascript
server.getPerson(personID);
// Will return a JSON object such as:
{
  "code": 200,
  "data": {
    "person_id": "32",
    "person_name": "Darth Vader",
    "person_dob": "1990-02-05"
  },
  "message": "Person Found"
}
```
### Add a person for the current user
```javascript
server.addPerson(name, dateOfBirth);
// Will return a JSON object such as:
{
  "code": 201,
  "data": {
    "person_id": "36",
    "person_name": "firstname lastname",
    "person_dob": "1999-01-02"
  },
  "message": "Person Added"
}
```
### Edit a person for the current user
```javascript
server.editPerson(personID, name, dateOfBirth);
// Will return a JSON object such as:
{
  "code": 200,
  "data": {
    "person_id": "35",
    "person_name": "Coolio",
    "person_dob": "1995-05-05"
  },
  "message": "Person Edited"
}
```
### Delete a person for the current user
```javascript
server.deletePerson(personID);
// Will return a JSON object such as:
{
  "code": 200,
  "data": {
    "person_id": "37",
    "person_name": "New Name",
    "person_dob": "1994-06-09"
  },
  "message": "Person Deleted"
}
```
## Gift Functions
### Get gifts for a person, for the current user
```javascript
server.getGifts(personID);
// Will return a JSON object such as:
{
  "code": 200,
  "data": [
    {
      "gift_id": 12,
      "gift_title": "Hockey Stick",
      "person_id": 31,
      "gift_url": "http://hockeylife.ca",
      "gift_price": "275.00",
      "gift_store": "Hockey Life"
    },
    {
      "gift_id": 13,
      "gift_title": "Hockey Stick",
      "person_id": 31,
      "gift_url": "http://hockeylife.ca",
      "gift_price": "275.00",
      "gift_store": "Hockey Life"
    },
    {
      "gift_id": 14,
      "gift_title": "Baseball Bat",
      "person_id": 31,
      "gift_url": "http://sportchek.ca",
      "gift_price": "60.00",
      "gift_store": "Sport Chek"
    }
  ],
  "message": "3 Gifts found for this Person"
}
```
### Add a gift for a person, for the current user
```javascript
server.addGift(personID, gift, url, price, store);
// Will return a JSON object such as:
{
  "code": 201,
  "data": {
    "person_id": "31",
    "gift_id": "15",
    "gift_title": "iPhone X",
    "gift_url": "https://www.apple.com/ca/iphone-x/",
    "gift_price": "1299.99",
    "gift_store": "Apple"
  },
  "message": "Gift Added"
}
```
### Delete a gift for a person, for the current user
```javascript
server.deleteGift(giftID);
// Will return a JSON object such as:
{
  "code": 200,
  "data": {
    "person_id": 31,
    "gift_id": "13",
    "gift_title": "Hockey Stick",
    "gift_url": "http://hockeylife.ca",
    "gift_price": "275.00",
    "gift_store": "Hockey Life"
  },
  "message": "Gift Deleted"
}
```

### Edit a gift for a person, for the current user
There is no app requirement to be able to edit gifts, so I have left this out for now. Can be added later if necessary.