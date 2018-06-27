


const apiURL = `https://free.currencyconverterapi.com/api/v5/countries`;   
let countriesCurrencies;
const dbPromise = idb.open('countries-currencies', 1, upgradeDB => {
  // Note: we don't use 'break' in this switch statement,
  // the fall-through behaviour is what we want.
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



const select = document.querySelector('#currency');
const url = `https://free.currencyconverterapi.com/api/v5/currencies`;
fetch(url).then(response => {
    if (response.status !== 200) {
        console.warn('Looks like there was a problem. Status Code: ' + response.status );
        return;
    }
    //Examine the text in the response
    response.json().then(results => {
        for (const result in results) {
            for(const id in results[result]){
                let opt = document.createElement('option');
                opt.value = results[result][id]["id"];
                opt.text = `${results[result][id]["currencyName"]}  ${results[result][id]["id"]}  ${results[result][id]["currencySymbol"]}`;
                document.getElementById('select').append(opt);
                
                let opt2 = document.createElement('option');
                opt2.value = results[result][id]["id"];
                opt2.text = `${results[result][id]["currencyName"]}  ${results[result][id]["id"]}  ${results[result][id]["currencySymbol"]}`;
                document.getElementById('select2').append(opt2);
            }
        }
        console.log(results);
    });
}).catch(function(err) {
    console.error('Fetch Error -', err);
});