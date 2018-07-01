

//Fetch Currencies and Display in Select Dropdown
const apiURL = `https://free.currencyconverterapi.com/api/v5/countries`;   
let countriesCurrencies;
const dbPromise = idb.open('countries-currencies', 1, upgradeDB => {

  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore('objs', {keyPath: 'id'});
      upgradeDB.createObjectStore('rates', {keyPath: 'id'});
  }
});
fetch(apiURL)
  .then( response => {
  return response.json();
})
  .then(currencies => {
    for (const currency in currencies) {
            for(const id in currencies[currency]){
                let opt = document.createElement('option');
                let opt2 = document.createElement('option');
                opt.value = currencies[currency][id]["currencyId"];
                opt.text = `${currencies[currency][id]["currencyName"]}  (${currencies[currency][id]["currencyId"]})`;
                opt2 = opt.cloneNode(true);
                select.add(opt);
                select2.add(opt2);
            }
        }
    //Store Currencies in Indexed DB
  dbPromise.then(db => {
    if(!db) return;
    countriesCurrencies = [currencies.results];
    const tx = db.transaction('objs', 'readwrite');
    const store = tx.objectStore('objs');
    let i = 0;
    countriesCurrencies.forEach(currency => {
        
      for (let value in currency) {
        store.put(currency[value]);
      }
    });
    return tx.complete;
  });
})
    //Fetch Currencies from IndexedDB and Display in Select Dropdown when Offline
    .catch(storedcurrencies =>{
    dbPromise.then(db => {
  return db.transaction('objs')
    .objectStore('objs').getAll();
}).then(results => {
        results.forEach(x=> {
            let opt = document.createElement('option');
            let opt2 = document.createElement('option');
            opt.value = x.currencyId;
            opt.text = `${x.currencyName} (${x.currencyId})`;
            
            opt2 = opt.cloneNode(true);
            select.add(opt);
            select2.add(opt2);
            
        });
    });
});





const curr = currency => {
    // Change background for every conversion
    const body = document.body;
    const colours = ['red', 'orange', 'yellow', 'green', 'blue'];
    const colour = colours[Math.floor(Math.random() * colours.length)];
    body.className = colour;
    
    //Get selectd Currency
    let e = document.getElementById('select');
    let sel = e.options[e.selectedIndex].value;
    let e2 = document.getElementById('select2');
    let sel2 = e2.options[e2.selectedIndex].value;
    let amounts = document.getElementById("amount").value;
    let query = `${sel}_${sel2}`;
    console.log(`Converting from ${sel}`);
    console.log(`Converting to ${sel2}`);
    const rateURL = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`; 
    
    //Fetch Exchange Rates from API, Store in IndexedDB and Multiply by amount
fetch(rateURL)
  .then( response => {
  return response.json();
})
  .then(data => {
    data.id= `${query}`;
    let newrates = data;
    let rate = newrates[query];
    let conversion = amounts * rate;
    let conversioni = Math.round(conversion * 100) / 100
    console.log(`Amount: ${conversioni}`);
    document.getElementById('answer').innerHTML = `Amount: ${conversioni}`;
    
  dbPromise.then(db => {  
    if(!db) return;
    const tx = db.transaction('rates', 'readwrite');
    const store = tx.objectStore('rates');
    store.put(newrates);
    return tx.complete;  
  });
    
})
    // Fetch Exchange Rates from IndexedDB and Multiply by amount when Offline
    .catch(storedrate =>{
    dbPromise.then(db => {
  return db.transaction('rates')
    .objectStore('rates').getAll(query);
}).then(results =>{
        let rate = results[0][query];
        let conversion = amounts * rate;
        let conversioni = Math.round(conversion * 100) / 100;
        console.log(`Amount: ${conversioni}`); 
        document.getElementById('answer').innerHTML = `Amount: ${conversioni}`;
    })
});
    }


    


