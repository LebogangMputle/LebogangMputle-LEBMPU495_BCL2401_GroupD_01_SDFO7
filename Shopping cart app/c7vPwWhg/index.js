//JavaScript code is importing Firebase modules to interact with the Firebase Realtime Database.
//These functions allow you to perform various operations on a Firebase Realtime Database, such as initializing the app, reading and writing data, listening for changes, and removing data.
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL : "https://shopping-cart-app-1213d-default-rtdb.europe-west1.firebasedatabase.app/"// Configuration settings for connecting to the Firebase Realtime Database it also works on a unique database location.
}
const app = initializeApp(appSettings) // begin the Firebase app with the provided settings
const database = getDatabase(app) // Get a reference to the Firebase Realtime Database using the initialized app
const shoppingListInDB = ref(database, "shoppingList") // Create a reference to the "shoppingList" location in the database

const inputFieldEl = document.getElementById("input-field") // Input field for adding items
const addButtonEl = document.getElementById("add-button") // Button for adding items
const shoppingListEl = document.getElementById("shopping-list") // Shopping list element in the HTML

// Add an event listener to the "add" button element
addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value // Get the value of the input field
    
    push(shoppingListInDB, inputValue) // Push the input value to the "shoppingList" location in the database
    
    clearInputFieldEl() //calling a function to clear the input field
})

//the main operating code.
onValue(shoppingListInDB, function(snapshot) { // Listen for changes to the "shoppingList" location in the database
   if (snapshot.exists()) {                    //check for data in the shoppinglist location
    let itemsArray = Object.entries(snapshot.val()) // Convert the snapshot value to an array of key-value pairs
    
    clearShoppingListEl() // calling a function to clear the shopping list element
    
    //get the current item's and ID's then loop through each item in an items array
    for (let i = 0; i < itemsArray.length; i++) {
        
        let currentItem = itemsArray[i]
        let currentItemID = currentItem[0]
        let currentItemValue = currentItem[1]
        
        appendItemToShoppingListEl(currentItem) // Append the current item to the shopping list element
    }
   }else {
       shoppingListEl.innerHTML = "no items..." //message to be displayed if the are no items in the list.
   } 
})

function clearShoppingListEl() { //clearing the shopping list element
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {  //clearing the inputfield element
    inputFieldEl.value = ""
}

// Function to append an item to the shopping list element
function appendItemToShoppingListEl(item) {
   
   let itemID = item[0]             // Extract the item ID and value from the input item array
   let itemValue = item[1]          // The value of the item
   
   let newEl = document.createElement("li") //creating a new list 
   
   newEl.textContent = itemValue // Set the text content of the new list item to the item value
   
   newEl.addEventListener("click", function(){
       let exactLocationOfItemInDB = ref (database, `shoppingList/${itemID}`) // Get the exact location of the item in the database using its ID
       
       remove(exactLocationOfItemInDB) // Remove the item from the database
   })
   shoppingListEl.append(newEl) // Append the new list item to the shopping list element
}