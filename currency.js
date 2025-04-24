// currency.js
const https = require('https');
const fs = require('fs');

// API info
const url = 'https://api.currencyfreaks.com/v2.0/rates/latest?apikey=35d35c366d2743e399bebdf20e32d157&symbols=SGD,EUR,INR';

// Fetch data from API
https.get(url, res => {
  let data = '';

  // Accumulate response data
  res.on('data', chunk => {
    data += chunk;
  });

  res.on('end', () => {
    const parsed = JSON.parse(data);

    const inr = parseFloat(parsed.rates.INR);
    const sgd = parseFloat(parsed.rates.SGD);
    const eur = parseFloat(parsed.rates.EUR);

    const d_usd = inr;
    const d_sgd = d_usd / sgd;
    const d_eur = d_usd / eur;

    const result = {
      date: parsed.date,
      base: parsed.base,
      d_usd: d_usd.toFixed(4),
      d_sgd: d_sgd.toFixed(4),
      d_eur: d_eur.toFixed(4),
      last_updated: new Date().toISOString() // Add system timestamp
    };

    // Write to JSON file
    fs.writeFileSync('currency.json', JSON.stringify(result, null, 2));
    console.log('Currency data saved to currency.json at', result.last_updated);
  });

}).on('error', err => {
  console.error('Error fetching data:', err.message);
});
