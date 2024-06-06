// import puppeteer from 'puppeteer';
// import notifier from "node-notifier"
// import { createObjectCsvWriter } from 'csv-writer';

// (async () => {
//     // Launch the browser and open a new blank page
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();
//     await page.setViewport({
//         // deviceScaleFactor: 1,
//         isLandscape: false,
//         width: 2000, height: 1000
//     });
//     // Navigate the page to a URL
//     await page.goto('https://www.nseindia.com/market-data/live-equity-market?symbol=NIFTY%2050');


//     await new Promise(resolve => setTimeout(resolve, 10000));

//     // Wait for the table to be visible
//     await page.waitForSelector('#equityStockTable');
//     await page.focus(`#equityStockTable`)

//     // Selector for the table
//     const tableSelector = `#equityStockTable`;

//     // Scrape data from the table
//     const tableData = await page.evaluate((tableSelector) => {
//         const table = document.querySelector(tableSelector);
//         if (!table) {
//             console.error('Table not found. Check if the selector is correct.');
//             return [];
//         }

//         const rows = table.querySelectorAll('tr');
//         console.log("Number of rows:", rows.length);

//         const data = [];
//         let headers = [];

//         // Loop through each row
//         rows.forEach((row, rowIndex) => {
//             const rowData = {};
//             const cells = row.querySelectorAll('td, th');

//             // Loop through each cell in the row
//             cells.forEach((cell, index) => {
//                 if (rowIndex === 0) {
//                     // Extract header names from the first row
//                     headers.push(cell.textContent.trim());
//                 } else {
//                     // Use header names for keys in subsequent rows
//                     rowData[headers[index]] = cell.textContent.trim();
//                 }
//             });

//             if (Object.keys(rowData).length > 0 && rowIndex !== 0) {
//                 data.push(rowData); // Push the row data object into the array except for the header row
//             }
//         });

//         const calculateRSI = (dayChange, monthChange) => {
//             // let avgGain = change > 0 ? change / 1 : 0;
//             // let avgLoss = change <= 0 ? change / 1 : 0;;

//             // Calculate average gain and average loss
//             // for (let i = 1; i < changes.length; i++) {
//             // const change = changes;
//             // if (change > 0) {
//             //     avgGain += change;
//             // } else {
//             //     avgLoss += Math.abs(change);
//             // }
//             // }
//             // avgGain /= period;
//             // avgLoss /= period;

//             // Calculate RS and RSI
//             // let RSI = 0;
//             // const RS = avgLoss === 0 ? Infinity : avgGain / avgLoss;
//             // console.log({ RS })
//             // if (RS == Infinity) {
//             //     RSI = 100 - (100 / (1 + Infinity))
//             // } else {
//             //     RSI = 100 - (100 / (1 + RS));
//             // }
//             // return RSI;
//         };

//         // Calculate RSI for each data object
//         for (const item of data) {
//             const changes = [];
//             // Assuming 'Change %' is the field representing price changes
//             // const changePercent = parseFloat(item['Change %'].replace('%', ''));
//             // changes.push(changePercent);
//             // Calculate price changes for the rest of the objects
//             // Push them to the changes array

//             // Calculate RSI for the current object
//             const rsi = calculateRSI(item["%Chng"], item[`30 d  %chng`]); // 14 is the standard period for RSI calculation
//             console.log("rrrrrrrrrrrrrrrrrrrrrrr", rsi)
//             // Add RSI value to the object
//             item['RSI'] = rsi.toFixed(2); // Round to 2 decimal places
//         }
//         return data;
//     }, tableSelector);

//     // Output the table data
//     notifier.notify('Message');

//     // Object
//     notifier.notify({
//         title: 'Nifty 50 Alert',
//         message: 'Hi , You have got stocks that hits RSI',
//         sound: true, // Only Notification Center or Windows Toasters
//         wait: true,
//         actions: ['Yes', 'No']
//     });

//     notifier.on('click', async function (notifierObject, options, event) {
//         if (options.activationValue === 'Yes') {
//             console.log("oks rrororor")
//             await browser.close();
//         } else {
//             console.log('User chose not to download the data.');
//             await browser.close();
//         }
//     });
//     console.log(tableData)
//     exportToCSV(tableData)
//     // Close the browser
//     await browser.close();
// })();

// export async function exportToCSV(data) {
//     const csvWriter = createObjectCsvWriter({
//         path: 'table_data.csv',
//         header: Object.keys(data[0]).map(header => ({ id: header, title: header }))
//     });
//     await csvWriter.writeRecords(data);
//     console.log('CSV file has been written successfully');

// }


import puppeteer from 'puppeteer';
import notifier from "node-notifier"
import { createObjectCsvWriter } from 'csv-writer';


(async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({
        // deviceScaleFactor: 1,
        isLandscape: false,
        width: 2000, height: 1000
    });
    await page.goto('https://www.nseindia.com/');
    await page.waitForSelector('body > header > nav > div.container-fluid.d-none.d-sm-block > div');

    await page.hover(`#link_2`);
    await page.waitForSelector(`a.nav-link[href="/market-data/live-market-indices"]`);
    await page.click('a.nav-link[href="/market-data/live-market-indices"]');

    // Wait for the new page to load
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    // Wait for the table to be visible on the new page
    await page.waitForSelector('#equityStockTable');
    await page.focus(`#equityStockTable`);

    // Selector for the table
    const tableSelector = `#equityStockTable`;

    // Scrape data from the table
    const tableData = await page.evaluate((tableSelector) => {
        const table = document.querySelector(tableSelector);
        if (!table) {
            console.error('Table not found. Check if the selector is correct.');
            return [];
        }

        const rows = table.querySelectorAll('tr');
        console.log("Number of rows:", rows.length);

        const data = [];
        let headers = [];

        // Loop through each row
        rows.forEach((row, rowIndex) => {
            const rowData = {};
            const cells = row.querySelectorAll('td, th');

            // Loop through each cell in the row
            cells.forEach((cell, index) => {
                if (rowIndex === 0) {
                    // Extract header names from the first row
                    headers.push(cell.textContent.trim());
                } else {
                    // Use header names for keys in subsequent rows
                    rowData[headers[index]] = cell.textContent.trim();
                }
            });

            if (Object.keys(rowData).length > 0 && rowIndex !== 0) {
                data.push(rowData); // Push the row data object into the array except for the header row
            }
        });

        const calculateRSI = (dayChange, monthChange) => {
            // let avgGain = change > 0 ? change / 1 : 0;
            // let avgLoss = change <= 0 ? change / 1 : 0;;

            // Calculate average gain and average loss
            // for (let i = 1; i < changes.length; i++) {
            // const change = changes;
            // if (change > 0) {
            //     avgGain += change;
            // } else {
            //     avgLoss += Math.abs(change);
            // }
            // }
            // avgGain /= period;
            // avgLoss /= period;

            // Calculate RS and RSI
            // let RSI = 0;
            // const RS = avgLoss === 0 ? Infinity : avgGain / avgLoss;
            // console.log({ RS })
            // if (RS == Infinity) {
            //     RSI = 100 - (100 / (1 + Infinity))
            // } else {
            //     RSI = 100 - (100 / (1 + RS));
            // }
            // return RSI;
        };

        // Calculate RSI for each data object
        for (const item of data) {
            const changes = [];
            // Assuming 'Change %' is the field representing price changes
            // const changePercent = parseFloat(item['Change %'].replace('%', ''));
            // changes.push(changePercent);
            // Calculate price changes for the rest of the objects
            // Push them to the changes array

            // Calculate RSI for the current object
            const rsi = calculateRSI(item["%Chng"], item[`30 d  %chng`]); // 14 is the standard period for RSI calculation
            console.log("rrrrrrrrrrrrrrrrrrrrrrr", rsi)
            // Add RSI value to the object
            item['RSI'] = rsi.toFixed(2); // Round to 2 decimal places
        }
        return data;
    }, tableSelector);

    // Output the table data
    notifier.notify('Message');

    // Object
    notifier.notify({
        title: 'Nifty 50 Alert',
        message: 'Hi , You have got stocks that hits RSI',
        sound: true, // Only Notification Center or Windows Toasters
        wait: true,
        actions: ['Yes', 'No']
    });

    notifier.on('click', async function (notifierObject, options, event) {
        if (options.activationValue === 'Yes') {
            console.log("oks rrororor")
            await browser.close();
        } else {
            console.log('User chose not to download the data.');
            await browser.close();
        }
    });
    console.log(tableData)
    exportToCSV(tableData)
    // Close the browser
    await browser.close();
})();

export async function exportToCSV(data) {
    const csvWriter = createObjectCsvWriter({
        path: 'table_data.csv',
        header: Object.keys(data[0]).map(header => ({ id: header, title: header }))
    });
    await csvWriter.writeRecords(data);
    console.log('CSV file has been written successfully');

}
