const { google } = require('googleapis');
const Promise = require('promise');
const credentials = require('./credentials.json');
const spreadSheetTitle = "Friends rating";
const sheetTitle = "friends";
const spreadSheetCols = ["Name", "Status", "Rating", "Official Site", "Summary"];

const googleClient = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

/**
 * Authenticate google api client
 * @return {Promise<object>} - The authenticated google client
 */
const authClient = async() =>{
    return new Promise((resolve, reject) =>{
        googleClient.authorize((err, tokens) =>{
            if(err){
                throw Error('Authentication failed');
            }else{
                resolve(googleClient);
            }
        });
    });
}

/**
 * Creates a new Google Spreadsheet.
 * @param {object} client - The Authorized google client
 * @return {Promise<string>} - The spreadsheet ID  
 */
const createNewGS = async(client) =>{
    return new Promise((resolve, reject) =>{
        const sheets = google.sheets({version: 'v4', auth: client});
        const resource = {
            properties: {
                title: spreadSheetTitle,
            },
        };
        sheets.spreadsheets.create({
            resource, 
            fields: 'spreadsheetId',
        }, (err, spreadsheet) =>{
            if(err){
                reject(err);
            }
            else{
                resolve(spreadsheet.data.spreadsheetId);
            }
        });
    });
}

/**
 * Creates a new sheet in a specific spreadsheet
 * @param {object} client - The Authorized google client
 * @param {string} spreadsheetId - The spreadsheet ID
 * @return {Promise<string>} - The sheetId of the new sheet created
 */
const createSheet = async(client, spreadsheetId) =>{
    return new Promise((resolve, reject) =>{
        const sheets = google.sheets({version: 'v4', auth: client});
        let requests=[{
            addSheet:{
                properties:{
                    title: sheetTitle,
                }
            }
        }];
        sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            resource: {requests}
        }, (err, response) =>{
            if(err){
                console.log(err);
                reject(err);
            }
            else{
                resolve(response.data.replies[0].addSheet.properties.sheetId);
            }
        });
    });
}

/**
 * 
 * @param {object} client - The Authorized google client
 * @param {string} spreadsheetId - The spreadsheet ID
 * @param {string[][]} data - The Data to add to google sheets
 * 
 */
const insertData = async(client, spreadsheetId, data) =>{
    return new Promise((resolve, reject) =>{
        const sheets = google.sheets({version: 'v4', auth: client});
        const values = [spreadSheetCols,]
        data.forEach(element => {
            values.push(element);
        });
        const resource = {
            values,
        };
        const range = sheetTitle;
        sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: "RAW",
            insertDataOption: 'INSERT_ROWS',
            resource,
        }, (err, response) =>{
            if(err){
                reject(err);
            }
            else{
                resolve(response);
            }
        });
    });
}

exports.authClient = authClient;
exports.createNewGS = createNewGS;
exports.createSheet = createSheet;
exports.insertData = insertData;