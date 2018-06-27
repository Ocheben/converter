self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('assets').then(function(cache) {
     return cache.addAll([
        '/',
        '/index.html',
        '/idb.js',
        '/idbi.js',
        '/assets/js/jquery.min.js',
        '/assets/js/main.js',
        '/assets/js/skel.min.js',
        '/assets/js/util.js',
        '/assets/css/main.css'
     ]);
   })
 );
});

self.addEventListener('fetch', function(event) {

console.log(event.request.url);

event.respondWith(

caches.match(event.request).then(function(response) {

return response || fetch(event.request);

})

);

});