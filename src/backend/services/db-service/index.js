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

async function addPurchaseData(purchaseID, accountAddress, cardAddress, signature, status) {
    return new Promise((resolve, reject) => {
        db.run(`UPDATE payments SET 
            accountAddress = ?,
            cardAddress = ?,
            signature = ?,
            status = ?
            WHERE purchaseId = ?`,
            [
                accountAddress,
                cardAddress,
                signature,
                status,
                purchaseID,
            ],
            (result, error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
    })
}

async function updatePurchaseStatus(purchaseID, status) {
    return new Promise((resolve, reject) => {
        db.run(`UPDATE payments SET 
            status = ?
            WHERE purchaseId = ?`,
            [
                status,
                purchaseID,
            ],
            (result, error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
    })
}


module.exports = {
    getUsers,
    getServices,
    createPurchase,
    getPurchase,
    addPurchaseData,
    updatePurchaseStatus
}