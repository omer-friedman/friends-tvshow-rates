const { google } = require('googleapis');
const Promise = require('promise');
const credentials = require('./credentials.json');
const spreadSheetTitle = "Friends rating";
const sheetTitle = "friends";
const spreadSheetCols = ["Name", "Status", "Rating", "Official Site", "Summary"];

//Google api client account
const googleClient = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file'
    ]
);

/**
 * Authenticate google api client
 * @return {Promise<object>} - The authenticated google client
 */
const authClient = async() =>{
    return new Promise((resolve, reject) =>{
        googleClient.authorize((err, tokens) =>{
            if(err){
                reject("Authentication Failed");
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
 * Rename the main sheet to 'sheetTitle'
 * @param {object} client - The Authorized google client
 * @param {string} spreadsheetId - The spreadsheet ID
 * @return {Promise<string>} - The sheetId of the new sheet created
 */
const renameSheet = async(client, spreadsheetId) =>{
    return new Promise((resolve, reject) =>{
        const sheets = google.sheets({version: 'v4', auth: client});
        let requests={
            "updateSheetProperties":{
                "properties":{
                    "sheetId": 0,
                    "title": sheetTitle,
                },
                fields: 'title'
            },
        };
        sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            resource: {requests}
        }, (err, response) =>{
            if(err){
                console.log(err);
                reject(err);
            }
            else{
                resolve(`Sheet renamed to ${sheetTitle}`);
            }
        });
    });
}

/**
 * Insert all data to the spreadsheet - column name and details.
 * @param {object} client - The Authorized google client
 * @param {string} spreadsheetId - The spreadsheet ID
 * @param {string[][]} data - The Data to add to google sheets
 * @return {number} - The number of rows effected.
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
                resolve(response.data.updates.updatedRows);
            }
        });
    });
}

/**
 * Give read permissions to the spreadsheet
 * After running this method, the spreadsheet will apear in the provided (emails) google accounts drive.
 * @param {object} client - The Authorized google client
 * @param {string} spreadsheetId - The spreadsheet ID
 * @param {string[]} emails - list of emails to give access to the spreadsheet
 */
const giveReadPermissions = async(client, spreadsheetId, emails) =>{
    return new Promise((resolve, reject) =>{
        const drive = google.drive({version: "v3", auth: client});
        let permissions = []
        //create a permission property to each email
        emails.forEach(email =>{
            permissions.push({
                type: 'user',
                role: 'reader',
                emailAddress: email
            })
        });
        //loop each permission and execute with google drive api
        permissions.forEach((permission) =>{
            drive.permissions.create({
                resource: permission,
                fileId: spreadsheetId,
                fields: 'id',
            }, function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    console.log(`${permission.emailAddress}- Permission ID: ${res.data.id}`);
                }
            });
        });
        resolve(null);
    });
}


exports.authClient = authClient;
exports.createNewGS = createNewGS;
exports.renameSheet = renameSheet;
exports.insertData = insertData;
exports.giveReadPermissions = giveReadPermissions;