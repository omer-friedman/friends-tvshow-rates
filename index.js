const http = require('http');
const googleServices = require('./google-api-helper');
const tvmazeServices = require('./tvmaze-api-helper');
const spreadSheetTitle = "Friends rating";
const spreadSheetCols = ["Name", "Status", "Rating", "Official Site", "Summary"];

(async function(){
    const gsClient = await googleServices.authClient().then(res => {
        return res
    });
    const spreadsheetId = await googleServices.createNewGS(gsClient, spreadSheetTitle).then(res => {
        return res
    });
    console.log(spreadsheetId);
})();

