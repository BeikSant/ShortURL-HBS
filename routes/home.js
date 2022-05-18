const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const urls = [
        {origin: 'www.google.com1', shortURL: 'dsafjh1'},
        {origin: 'www.google.com2', shortURL: 'dsafjh2'},
        {origin: 'www.google.com3', shortURL: 'dsafjh3'},
        {origin: 'www.google.com4', shortURL: 'dsafjh4'}
    ];
    res.render('home', {urls: urls});
});

module.exports = router;