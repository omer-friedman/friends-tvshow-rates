const http = require('http');
const Promise = require('promise');


/**
 * getDataFromTVMaze:
 * Make a GET request to fetch tv shows from api.tvmaze
 * @return {string[][]} - The data as a 2d array - each array represents a tv show properties
 */
const getDataFromTVMaze = async(options) =>{
    return new Promise((resolve, reject) =>{
        http.request(options, response =>{
            let data = '';
            response.on('data', function(chunk){
                data += chunk;
            }).on('error', function(err){
                reject(err);
            }).on('end', function(){
                data = prepareData(data)
                resolve(data);
            });
        }).end();
    });
}

/**
 * Prepare data to be ready to insert into the google sheets
 * @param {string} data - JSON alike string recieved from the api call
 * @return {string[][]} - 2d array containing the specific columns from all tv shows
 */
const prepareData = (data) =>{
    dataJson = JSON.parse(data);
    const summaryRegex = /\<[^\>]*\>/g;
    res = []
    for(var index in dataJson){
        const { name, status, rating, officialSite, summary} = dataJson[index].show;
        res.push([name, status, rating.average, officialSite, summary.replace(summaryRegex, '')])
    }
    return res;
}

exports.getDataFromTVMaze = getDataFromTVMaze;