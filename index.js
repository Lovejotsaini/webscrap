import puppeteer from 'puppeteer';

(async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Navigate the page to a URL
    await page.goto('https://in.tradingview.com/screener/');

    const tableSelector = '#js-screener-container > div > div > div.tableContainer-OuXcFHzP > div > div > div.wrapper-yDuvR4fK > div > table'

    const tableData = await page.evaluate((tableSelector) => {

        const table = document.querySelector(tableSelector);
        const rows = table.querySelectorAll('tr'); // Select all table rows

        const data = [];
        let headers = [];

        // Loop through each row
        rows.forEach((row, rowIndex) => {
            const rowData = {};
            const cells = row.querySelectorAll('td, th'); // Select all cells in the row including th for headers
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

        return data;
    }, tableSelector);

    // Function to calculate RSI
    const calculateRSI = (changes, period) => {
        let avgGain = 0;
        let avgLoss = 0;

        // Calculate average gain and average loss
        // for (let i = 1; i < changes.length; i++) {
        const change = changes;
        if (change > 0) {
            avgGain += change;
        } else {
            avgLoss += Math.abs(change);
        }
        // }
        avgGain /= period;
        avgLoss /= period;
        console.log(avgGain, "loss", avgLoss)
        // Calculate RS and RSI
        const RS = avgLoss === 0 ? Infinity : avgGain / avgLoss;
        const RSI = 100 - (100 / (1 + RS));
        return RSI;
    };

    // Calculate RSI for each data object
    for (const item of tableData) {
        const changes = [];
        // Assuming 'Change %' is the field representing price changes
        const changePercent = parseFloat(item['Change %'].replace('%', ''));
        changes.push(changePercent);
        // Calculate price changes for the rest of the objects
        // Push them to the changes array

        // Calculate RSI for the current object
        const rsi = calculateRSI(changePercent, 14); // 14 is the standard period for RSI calculation
        console.log("RSI", rsi)
        // Add RSI value to the object
        item['RSI'] = rsi.toFixed(2); // Round to 2 decimal places
    }



    // Set screen size
    // await page.setViewport({ width: 1080, height: 1024 });

    // // Type into search box
    // await page.type('.devsite-search-field', 'automate beyond recorder');

    // // Wait and click on first result
    // const searchResultSelector = '.devsite-result-item-link';
    // await page.waitForSelector(searchResultSelector);
    // await page.click(searchResultSelector);

    // // Locate the full title with a unique string
    // const textSelector = await page.waitForSelector(
    //     'text/Customize and automate'
    // );
    // const fullTitle = await textSelector?.evaluate(el => el.textContent);

    // // Print the full title
    // console.log('The title of this blog post is "%s".', fullTitle);
    // await browser.waitForTarget(() => false)
    // await browser.close();
    // console.log(tableData);
    await browser.close();
})();


// import puppeteer from 'puppeteer';

// (async () => {
//     const browser = await puppeteer.launch({ headless: false })
//     const page = await browser.newPage()
//     await page.goto('https://trix-editor.org/')
//     await page.focus('trix-editor')
//     await page.keyboard.type('Just adding a title')
//     await page.screenshot({ path: 'keyboard.png' })
//     await browser.waitForTarget(() => false)
//     await browser.close()
// })()