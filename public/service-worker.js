const APP_PREFIX = 'BudgetTracker-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  // don't include icons due to cache limits
  './js/idb.js',
  './js/index.js'

]
// use 'self' because service workers run before the window obj has been created
// 'self' refers to the service worker obj
self.addEventListener('install', function (e) {
  // waitUntil tells broswer to wait until work is complete before terminating service worker
  e.waitUntil(
    // finds specific cache by name and adds files to FILES_TO_CACHE array
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(FILES_TO_CACHE)
    })
  )
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    // .keys() returns array of cache names, called keyList
    caches.keys().then(function (keyList) {
      let cacheKeepList = keyList.filter(function (key) {
        // captures caches with a prefix, stores them to an array cacheKeepList using .filter()
        return key.indexOf(APP_PREFIX);
      });
      // adds the current cache to the keeplist
      cacheKeepList.push(CACHE_NAME);
      // returns a Promise that resolves once old versions of cache are deleted
      return Promise.all(keyList.map(function (key, i) {
        if (cacheKeepList.indexOf(key) === -1) {
          console.log('deleting cache: ' + keyList[i]);
          return caches.delete(ketList[i]);
        }
      }));
    })
  )
});

// listens for fetch event, logs URL of requested resource, defines how to respond to request
self.addEventListener('fetch', function (e) {
  console.log('fetch request: ' + e.request.url)
  e.respondWith(
    caches.match(e.request).then(function (res) {
      
      if (res) {
        console.log('responding with cache: ' + e.request.url)
        return res
      } else {
        console.log('file is not cached, fetching: ' + e.request.url)
        return fetch(e.request)
      }
      
      //ES6 can be used instead of if else (this works!)
      //return res || fetch(e.request)
    })
  )
});
