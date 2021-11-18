// packages needed in this file
const express = require('express')
const validUrl = require('valid-url')
const shortid = require('shortid')
// Introduce el middleware
const bodyParser = require("body-parser");

// creating express route handler
const router = express.Router()

// import the Url database model
const Url = require('../models/urlModel')

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

// @route    POST /api/url/shorten
// @description     Create short URL

// The API base Url endpoint
const baseUrl = 'http:localhost:3000'

router.post('/shorturl', async (req, res) => {

    // console.log(req.body);
    const {
        url
    } = req.body // destructure the longUrl from req.body.longUrl

    // check base url if valid using the validUrl.isUri method
    if (!validUrl.isUri(baseUrl)) {
        return res.status(401).json('Invalid base URL')
    }

    // if valid, we create the url code
    const urlCode = shortid.generate()

    // check long url if valid using the validUrl.isUri method
    if (validUrl.isUri(url)) {
        try {
            /* The findOne() provides a match to only the subset of the documents 
            in the collection that match the query. In this case, before creating the short URL,
            we check if the long URL was in the DB ,else we create it.
            */
            let url2 = await Url.findOne({
                url
            })

            // url exist and return the respose
            if (url2) {
                res.json({"original_url": url2.url, "short_url": url2.urlCode})
            } else {
                // join the generated short code the the base url
                const shortUrl = urlCode

                // invoking the Url model and saving to the DB
                url2 = new Url({
                    url,
                    shortUrl,
                    urlCode,
                    date: new Date()
                })
                await url2.save()
                res.json({"original_url": url2.url, "short_url": url2.urlCode})
            }
        }
        // exception handler
        catch (err) {
            console.log(err)
            res.status(500).json('Server Error')
        }
    } else {
        res.status(401).json({"error": "Invalid URL"})
    }
})

module.exports = router