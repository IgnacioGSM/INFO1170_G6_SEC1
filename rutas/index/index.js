const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.session.usuario) {
        res.render('index', {user: req.session.usuario});
    } else {
        res.render('index', {user: 0});
    }
});

module.exports = router;