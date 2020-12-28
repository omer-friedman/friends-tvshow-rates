const { google } = require('googleapis');
const Promise = require('promise');
const credentials = require('./credentials.json');

const googleClient = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

/**
 * Authenicate google api client
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
 * @param {string} title - The spreadsheet title
 * @param {Array} fields - The spreadsheet fields
 * @return {Promise<string>} - The spreadsheet ID  
 */
const createNewGS = async(client, title) =>{
    return new Promise((resolve, reject) =>{
        const sheets = google.sheets({version: 'v4', auth: client});
        const resource = {
            properties: {
                title,
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
                console.log(`Spreadsheet ID: ${spreadsheet.data.spreadsheetId}`);
                resolve(spreadsheet.data.spreadsheetId);
            }
        });
    })
}

exports.authClient = authClient;
exports.createNewGS = createNewGS;