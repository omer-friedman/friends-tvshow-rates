const googleServices = require('./google-api-helper');
const tvmazeServices = require('./tvmaze-api-helper');

//The url we want: http://api.tvmaze.com/search/shows?q=friends
const options = {
    host: 'api.tvmaze.com',
    path: '/search/shows?q=friends',
    method: 'GET',
};

(async function(){
    const data = await tvmazeServices.getDataFromTVMaze(options).then(res =>{return res;});
    const gsClient = await googleServices.authClient().then(res => {return res});
    const spreadsheetId = await googleServices.createNewGS(gsClient).then(res => {return res});
    const sheetId = await googleServices.createSheet(gsClient, spreadsheetId).then(res =>{return res;})
    await googleServices.insertData(gsClient, spreadsheetId, data).then(res => {
        console.log(res);
    });

})();

