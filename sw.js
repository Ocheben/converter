self.addEventListener('install', e => {
 e.waitUntil(
   caches.open('assets').then(cache => {
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

self.addEventListener('fetch', event => {


event.respondWith(

caches.match(event.request).then(response => {

return response || fetch(event.request);

})

);

});