const googleServices = require('./google-api-helper');
const tvmazeServices = require('./tvmaze-api-helper');
const readline = require("readline");
const { exit } = require('process');
const sharedEmails = [];

//The url we want: http://api.tvmaze.com/search/shows?q=friends
const options = {
    host: 'api.tvmaze.com',
    path: '/search/shows?q=friends',
    method: 'GET',
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter your email for sharing the spreadsheet: ", (email) =>{
        const emailReg = /^[^@]+@gmail.com$/ //validate google account
        if(!email.match(emailReg)){
            console.log("The email must be your google account");
            exit(1);
        }
        else{
            sharedEmails.push(email);
            rl.close();
        }
    });

rl.on('close', ()=>{
    main();
})


const main = async() =>{
    try{
        const data = await tvmazeServices.getDataFromTVMaze(options).then(res =>{
            return res;
        })
        const gsClient = await googleServices.authClient().then(res => {
            return res
        })
        const spreadsheetId = await googleServices.createNewGS(gsClient).then(res => {
            console.log(`Spreadsheet link: https://docs.google.com/spreadsheets/d/${res}`);
            return res
        })
        await googleServices.renameSheet(gsClient, spreadsheetId).then(res =>{})
        await googleServices.giveReadPermissions(gsClient, spreadsheetId, sharedEmails).then(() =>{});
        await googleServices.insertData(gsClient, spreadsheetId, data).then(res => {
            console.log('Numbers of rows effected:', res);
        })
    }catch(err){
        console.log(err);
        exit(1);
    }
};

