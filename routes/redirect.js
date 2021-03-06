const express = require('express')

const router = express.Router()

const Url = require('../models/urlModel')

// : app.get(/:code)

// @route       GET /:code
// @description    Redirect to the long/original URL 
router.get('/:code', async (req, res) => {
    
    try {
        // find a document match to the code in req.params.code
        const url = await Url.findOne({
            urlCode: req.params.code
        })

        if (url) {
            // when valid we perform a redirect
            return res.redirect(url.url)
        } else {
            // else return a not found 404 status
            return res.json({error: 'invalid url'})
        }

    }
    // exception handler
    catch (err) {
        console.error(err)
        res.status(500).json('Server Error')
    }
})


module.exports = router