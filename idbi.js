


const apiURL = `https://free.currencyconverterapi.com/api/v5/currencies`;   
let countriesCurrencies;
const dbPromise = idb.open('countries-currencies', 1, upgradeDB => {

  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore('objs', {keyPath: 'id'});
  }
});
fetch(apiURL)
  .then(function(response) {
  return response.json();
})
  .then(function(currencies) {
  dbPromise.then(db => {
    if(!db) return;
    countriesCurrencies = [currencies.results];
    const tx = db.transaction('objs', 'readwrite');
    const store = tx.objectStore('objs');
    let i = 0;
    countriesCurrencies.forEach(function(currency) {
      for (let value in currency) {
        store.put(currency[value]);
      }
    });
    return tx.complete;
  });
});

dbPromise.then(db => {
  return db.transaction('objs')
    .objectStore('objs').getAll();
}).then(results => {
        results.forEach(x=> {
            let opt = document.createElement('option');
            let opt2 = document.createElement('option');
            opt.value = x.id;
            opt.text = `${x.currencyName} (${x.id})`;
            
            opt2 = opt.cloneNode(true);
            select.add(opt);
            select2.add(opt2);
            
        });
        console.log(results);
    });



