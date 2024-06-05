// const table = document.querySelector(tableSelector);
// const rows = table.querySelectorAll('tr'); // Select all table rows

// const data = [];
// let headers = [];

// // Loop through each row
// rows.forEach((row, rowIndex) => {
//     const rowData = {};
//     const cells = row.querySelectorAll('td, th'); // Select all cells in the row including th for headers
//     // Loop through each cell in the row
//     cells.forEach((cell, index) => {
//         if (rowIndex === 0) {
//             // Extract header names from the first row
//             headers.push(cell.textContent.trim());
//         } else {
//             // Use header names for keys in subsequent rows
//             rowData[headers[index]] = cell.textContent.trim();
//         }
//     });
//     if (Object.keys(rowData).length > 0 && rowIndex !== 0) {
//         data.push(rowData); // Push the row data object into the array except for the header row
//     }
// });

// return data;
