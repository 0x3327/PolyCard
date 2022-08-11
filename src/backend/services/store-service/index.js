const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const { expressjwt } = require("express-jwt");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const AuthService = require("../auth-service");
const DBService = require("../db-service");
const Web3Service = require("../web3-service").getInstance();
const utils = require("../../utils");
const { ethers } = require('ethers');

const privateKey = process.env.JWT_PRIVATE_KEY;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
app.use(cookieParser());
app.use(cors({ origin: '*', methods: 'OPTIONS,GET,HEAD,PUT,PATCH,POST,DELETE' }));
app.use(
    expressjwt({
        secret: privateKey,
        algorithms: ["HS256"],
    }).unless({ path: ["/login", "/info", "/approve_purchase"] })
);


app.post('/login', (req, res) => {
    console.log('POST /login');
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        DBService.getUsers(username, (error, results) => {
            if (error) throw error;

            if (results.length > 0) {
                const data = results[0];
                AuthService.verifyPassword(password, data.pwhash, data.salt).then((validated) => {
                    if (validated === true) {
                        const token = jwt.sign({ username }, privateKey, { algorithm: 'HS256', expiresIn: '2h' }, function (err, token) {
                            console.log(`User ${username} logged in successfully`);
                            res.status(200)
                            res.send({ token });
                        });
                    } else {
                        res.status(401);
                        console.log('Incorrect password');
                        res.status(401);
                        res.send('Incorrect Username and/or Password!');
                    }
                });
            } else {
                console.log('Incorrect Username');
                res.status(401);
                res.send('Incorrect Username and/or Password!');
            }
        });
    } else {
        res.status(401);
        res.send('Please enter Username and Password!');
    }
});

app.get('/services', (req, res) => {
    console.log('GET /services');

    DBService.getServices((error, results) => {
        if (error) throw error;

        res.send(JSON.stringify(results));
    });
})


app.get('/info', async (req, res) => {
    console.log('GET /info');

    const storeAddress = Web3Service.getStoreAddress();
    const storeID = await Web3Service.getStoreID();
    const storeName = await Web3Service.getStoreName();

    res.send({
        storeAddress,
        storeID,
        storeName
    });
})

app.post('/prepare_purchase', (req, res) => {
    console.log('POST /prepare_purchase');

    const purchaseID = utils.getRandom32BytesHexString();
    console.log(`Preparing purchase with purchaseID ${purchaseID}`);
    const serviceID = req.body.serviceID;
    const price = `${req.body.price}`;
    console.log(price);

    DBService.createPurchase(purchaseID, serviceID, price, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500);
            res.send('Could not create database entry for purchase!');
            return;
        }

        res.send(JSON.stringify({
            message: 'Successfully prepared for purchase, purchase awaiting buyer signature',
            purchaseID,
        }));
    });
})

app.post('/approve_purchase', (req, res) => {
    console.log('POST /approve_purchase');

    const { purchaseID, cardAddress, accountAddress, signature } = req.body;

    DBService.getPurchase(purchaseID, async (error, result) => {
        if (error) {
            console.error(error);

            res.status(500);
            res.send('Could not get database entry for purchase!');
            res.end();
            return;
        }

        const { serviceId: serviceID, price } = result;
        const storeAddress = Web3Service.getStoreAddress();

        // Construct hash from given values
        const hash = utils.createPaymentSignatureHash(purchaseID, serviceID, price, storeAddress);

        const recoveredAddress = ethers.utils.verifyMessage(ethers.utils.arrayify(hash), signature);
        console.log(`Recovered address: ${recoveredAddress}`);
        console.log(`Signer address: ${cardAddress}`);

        try {
            console.log('Adding purchase data to the database');
            await DBService.addPurchaseData(
                purchaseID, accountAddress,
                cardAddress, signature, 'Pending').then(async (result) => {
                    console.log(`Received db response ${result}`);

                    console.log('Sending transaction to the blockchain');
                    await Web3Service.issueService(accountAddress, price, purchaseID, serviceID, signature);
                    console.log('Transaction sent');
                    res.send('We\'ll process the purchase shortly...');
                    await DBService.updatePurchaseStatus(purchaseID, 'Completed');
                }).catch((error) => { throw Error(error) });
        } catch (error) {
            console.error(error);
            await DBService.updatePurchaseStatus(purchaseID, 'Failed');
            res.status(500);
            res.send(`Failed to issue service ${serviceID}\n${error}`);
        }
    });

})

const port = process.env.API_PORT || 8081;
let server = app.listen(port, function () {
    console.log(`Store service running on port ${port}...`);
});
