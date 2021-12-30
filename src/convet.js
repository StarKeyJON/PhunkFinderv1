let csvToJson = require('convert-csv-to-json');

let fileInputName = './components/rankings.csv'; 
let fileOutputName = 'phunk_Ranks.json';

csvToJson.generateJsonFileFromCsv(fileInputName,fileOutputName);
