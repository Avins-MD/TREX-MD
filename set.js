const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVUU5VEtwR0VCNnpDL29YR2NETDZrNjBrQVc3VGgvUHhZT3hWajF1YXBsdz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMTVGR1pHMmxiSkRmaFl5dThMcWhCZW1tMTZTaDlnQzBsOUdScnZGNzFuST0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJXRlBhTUgyRUFab3RVUjNDeERuU0lFak1PWUhERGNLOG5sM3ptbDAvSEZVPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJNUVJQd1l1QlFOTDBpYXNpUEpmMFlkdk4wTFNFNjdESlBpcWxPa204dm5NPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImlQKzJKRFR1RnVNTnYzTW5qTThEdzV3Z0M5UFRkbGQ2eDV4ZmtESitQbUk9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlVBTHViN0IzcEZtdVZBbXBtWlhtL3JtT0N2Y3lHTyt2RWpzeDJiMlhhbFk9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoia0t1RlRsS255ck16clZNWkI0MlBrZnFzWDNncmJRSEtuZ3lwczhUeEozRT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlNGcUwzN0g2WGNzNTRxR0RZdVFhb3hpZFVuQjhEU3c3SmU3TFNxK1FIST0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IndOd3cxM1NaUmxJamhQK3AySDJtKzFZSzl3bkd5OUZ2Wk9SZlR6RTNjUWpPZlJHbGVKSmRDeTlYbUFjcVNpUjc4TUZQZnhMSjNvOGo1am5YU3NuZkNnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjM4LCJhZHZTZWNyZXRLZXkiOiJDNDVLVjIrQWp0Yi9zNGQ0NytNT01YNGxSWnBuckJ0SXNQamhBVFdiZ2trPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJGNTJiYTV6aVRlMmtCUS1oV1d4Wk53IiwicGhvbmVJZCI6ImE3NTc0NjNkLTBjMmUtNGQ1OS1iY2RkLTBmMzdiOTViM2Q4MyIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJIMVlsbDZQYkZrM0h6Y0cxaGcwV3pJemJPQmM9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiSWVDa0N6ZCsvODlqbmNVQ1Y5Z0E0L090MEdZPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IkVUOUQ1WENUIiwibWUiOnsiaWQiOiIyNTQ3OTAxMzU5MzQ6MkBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSzI5Ni9FSEVJZVJ4N1lHR0FJZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoibHFtY2Nzb0g5TGFrdVI1Ni9SekJqZVFlbCtpV0NSdFVRRkdRR0tZYlNWdz0iLCJhY2NvdW50U2lnbmF0dXJlIjoibVVGaWp6bDlEd0J1eWl1Wm9LSHVQRU5hSjZBQXFkNFZKbS81L1hidDYyRU94SzFlZ3orMWVuOTB0RUhiWjZiZG1CaUk2dnppUjFkempzUFMzSU1JQUE9PSIsImRldmljZVNpZ25hdHVyZSI6IkZnbEIxT0hLZDB2T1ViZ2RDd2NNNnhKRVJ6cWtwc1ZxK0ptWEJFQTBjREMxajM5c3lodzZveDVicjVMaUxKMklWOWFZY21MRjlKRno0Ym5uY1FIeEJRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU0NzkwMTM1OTM0OjJAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCWmFwbkhMS0IvUzJwTGtlZXYwY3dZM2tIcGZvbGdrYlZFQlJrQmltRzBsYyJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTcyNTAyNDQwNCwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFHS1UifQ==',
    PREFIXE: process.env.PREFIX || "+",
    OWNER_NAME: process.env.OWNER_NAME || "Avins",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "254713972753",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "non",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'non',
    BOT : process.env.BOT_NAME || 'Avins 𝗠𝗱',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/e883c3cc22b0ded5e380e.jpg,https://telegra.ph/file/eca1a1dffe21dba0bc7bc.jpg,https://telegra.ph/file/5d3631dccfd838f49a9a8.jpg,https://telegra.ph/file/23df275c8026b7a1f1746.jpg',
    MODE: process.env.PUBLIC_MODE || "no",
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '1',
    CHATBOT : process.env.PM_CHATBOT || 'no',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, {
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
