//The url we want: http://api.tvmaze.com/singlesearch/shows?q=friends
const options = {
    host: 'api.tvmaze.com',
    path: '/singlesearch/shows?q=friends',
    method: 'GET',
}

/**
 * getDataFromAPI:
 * Make a GET request to fetch tv shows from api.tvmaze
 * @param response - callback resoponse from http
 */
const getDataFromAPI = (response) =>{
    let data = '';
    response.on('data', function(chunk){
        data += chunk;
    }).on('error', function(err){
        console.log(err);
    }).on('end', function(){
        createGoogleSheet(data);
    });
}

//Make http request
http.request(options, getDataFromAPI).end();

/**
 * createGoogleSheet:
 * Get data as JSON and insert it to a new Google Sheets using
 * Google-Sheets API v4
 * @param data - a JSON object to create a google sheet from.
 */
createGoogleSheet = (data) =>{
    
}