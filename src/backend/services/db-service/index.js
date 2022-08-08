const sqlite3 = require('sqlite3');

const databasePath = __dirname + "/polycard.db"
const db = new sqlite3.Database(databasePath);


function getUsers(username, callback) {
    db.all('SELECT * FROM accounts WHERE username = ?', [username], callback);
}

function getServices(callback) {
    db.all('SELECT * FROM services', [], (callback));
}

function createPurchase(purchaseID, serviceID, price, callback) {
    db.run('INSERT INTO payments (purchaseId, serviceId, price) values ( ?, ?, ?)', [
        purchaseID,
        serviceID,
        price,
    ], callback);
}

function getPurchase(purchaseID, callback) {
    db.get('SELECT * FROM payments WHERE purchaseId = ?', [purchaseID], callback);
}

function addPurchaseData(purchaseID, accountAddress, cardAddress, signature, callback) {
    db.run(`UPDATE payments SET 
            accountAddress = ?,
            cardAddress = ?,
            signature = ?
            WHERE purchaseId = ?`,
        [
            accountAddress,
            cardAddress,
            signature,
            purchaseID,
        ], callback);
}

module.exports = {
    getUsers,
    getServices,
    createPurchase,
    getPurchase,
}