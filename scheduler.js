// const { exec } = require('child_process');

// function checkTimeAndRun() {
//   const now = new Date();
//   const currentHour = now.getHours();
//   const currentMinute = now.getMinutes();

//   // Target time: 10:00 AM
//   if (currentHour === 10 && currentMinute === 0) {
//     console.log(`[${now.toLocaleString()}] Running currency.js...`);

//     exec('node currency.js', (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Error: ${error.message}`);
//         return;
//       }
//       if (stderr) {
//         console.error(`Stderr: ${stderr}`);
//         return;
//       }
//       console.log(`Output:\n${stdout}`);
//     });
//   }
// }

// // Check every minute
// setInterval(checkTimeAndRun, 60 * 1000);

// console.log("Scheduler is running. Waiting for 10:00 AM to run currency.js...");



// const { exec } = require('child_process');

// function shouldRunNow() {
//   const now = new Date();
//   const hours = now.getHours();
//   return hours === 18; // Between 10:00 and 10:59 AM
// }

// function runScheduler() {
//   if (shouldRunNow()) {
//     console.log(`[${new Date().toLocaleString()}] ✅ Running currency.js...`);
//     exec('node currency.js', (error, stdout, stderr) => {
//       if (error) {
//         console.error(`❌ Error running currency.js: ${error.message}`);
//         return;
//       }
//       if (stderr) {
//         console.error(`⚠️ stderr: ${stderr}`);
//         return;
//       }
//       console.log(`✅ currency.js Output:\n${stdout}`);
//     });
//   } else {
//     console.log(`[${new Date().toLocaleString()}] ⏳ Not time yet.`);
//   }
// }

// // Check every 30 minutes
// setInterval(runScheduler, 30 * 60 * 1000);

// // Run once immediately too
// runScheduler();

const { exec } = require('child_process');
const fs = require('fs');
const path = './currency.json';

// Check if currency.js was run in the last 24 hours
function notUpdatedInLast24Hours() {
  try {
    if (!fs.existsSync(path)) return true; // First time, run it

    const data = JSON.parse(fs.readFileSync(path, 'utf-8'));
    const lastUpdated = new Date(data.last_updated);
    const now = new Date();

    const hoursDiff = Math.abs(now - lastUpdated) / 36e5;
    return hoursDiff >= 24;
  } catch (err) {
    console.error("⚠️ Error reading or parsing currency.json:", err.message);
    return true; // Run as fallback
  }
}

function shouldRunNow() {
  const now = new Date();
  const hours = now.getHours();
  return hours === 10; // 10 AM (local system time)
}

function runScheduler() {
  if (shouldRunNow() && notUpdatedInLast24Hours()) {
    console.log(`[${new Date().toLocaleString()}] ✅ Running currency.js...`);
    exec('node currency.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error running currency.js: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`⚠️ stderr: ${stderr}`);
        return;
      }
      console.log(`✅ currency.js Output:\n${stdout}`);
    });
  } else {
    console.log(`[${new Date().toLocaleString()}] ⏳ Not time or already updated in last 24h.`);
  }
}

// Check every 30 minutes
setInterval(runScheduler, 30 * 60 * 1000);

// Run once immediately
runScheduler();

