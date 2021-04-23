// variable that holds the db connection
let db;
// establishes a connection the IndexedDB db
const request = indexedDB.open('budget-tracker', 1);
// this event occurs if the db version changes
request.onupgradeneeded = function (event) {
  // save ref to the db
  const db = event.target.result;
  // create an object store
  db.createObjectStore('new_budget', { autoIncrement: true });
};

// when succesful:
request.onsuccess = function(event) {
  // when db is create with its obj store
  db = event.target.result;

  // check if app is online
  if (navigator.onLine) {
    // function to send all local db data to api
  }
};

request.onerror = function(event) {
  console.log(event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(['new_budget'], 'readwrite');

  const budgetObjectStore = transaction.objectStore('new_budget');
  
  budgetObjectStore.add(record);
}