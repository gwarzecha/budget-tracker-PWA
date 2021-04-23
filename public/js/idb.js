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
    uploadBudget();
  }
};

request.onerror = function(event) {
  console.log(event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(['new_budget'], 'readwrite');

  const budgetObjectStore = transaction.objectStore('new_budget');
  
  budgetObjectStore.add(record);
};

function uploadBudget() {
  // open transaction to db
  const transaction = db.transaction(['new_budget'], 'readwrite');
  // access obj store
  const budgetObjectStore = transaction.objectStore('new_budget');
  // get all records from store and set to variable
  const getAll = budgetObjectStore.getAll();
  //upon successful .getAll():
  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch('/api/transaction', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(serverRes => {
        if (serverRes.message) {
          throw new Error(serverRes);
        }
        // open another transaction
        const transaction = db.transaction(['new_budget'], 'readwrite');
        // access new_budget obj store
        const budgetObjectStore = transaction.objectStore('new_budget');
        // clear all items in the store
        budgetObjectStore.clear();

        alert('All of your saved transactions have been submitted.')
      })
      .catch(err => {
        console.log(err)
      });
    }
  };
}

// listen for the app coming back online
window.addEventListener('online', uploadBudget);