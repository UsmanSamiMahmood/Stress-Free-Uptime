// This is a quick program made by Usman Mahmood to monitor the statuses of his websites, this program can be hosted on glitch.com 24/7.

// Request is the package which will be used to send the request to the website to monitor its status.
const request = require("request");

// Request-promise is the package which will be used to POST to the webhook url and notify me when a website returns any status code other than 200[OK].
const requestPromise = require("request-promise");

// This file stores the url we will be using for posting the webhooks as well as the url of the website we're checking.
const config = require("./config.json");

// Making the function where we check the status of the website.
function checkStatus(url) {
    request(`${url}`, function(error, response) {
        // An error is not anticipated but as always it could happen so below we will set up error handling, a webhook will be sent to notify me.

        if(response.statusCode !== 200) {
            // If the status code is anything other than 200 then we will class this as the website being offline then a webhook will be sent to a discord channel to notify me.
            var option2 = {
                method: "POST",
                url: `${config.STATUS_WEBHOOK_URL}`,
                body: {
                    "embeds": [{
                        "author": {
                            "name": "Automatic Website Status Checker",
                            "url": "https://github.com/UsmanSamiMahmood/"
                        },
                        "title": "Website Offline",
                        "url": `${url}`,
                        "description": `A request was sent to ${url} but it returned code: ${response.statusCode} || message: ${response.statusMessage}.`,
                        "footer": {
                            "text": "Website Checker."
                        },
                        "thumbnail": {
                            "url": "https://upload.wikimedia.org/wikipedia/en/b/bc/Title_screen_for_the_Netflix_series_Shadow.png" 
                        }
                    }]
                },
                json: true,
            };
            // Below is the part where we actually post the data.
            requestPromise(option2)
                .then(function() {
                    console.warn("Website offline, webhook sent.");
                })
                .catch(function(err) {
                    console.error(`Error encountered whilst attempting to send webhook: ${err}.`)
                });
        }

        if (error) {
            var option = {
                method: "POST",
                url: `${config.ERROR_WEBHOOK_URL}`,
                body: {
                    "embeds": [{
                        "author": {
                            "name": "Automatic Website Status Checker",
                            "url": "https://github.com/UsmanSamiMahmood/Automatic-Website-Checker/"
                        },
                        "title": "Request Failed",
                        "url": "https://github.com/UsmanSamiMahmood/Automatic-Website-Checker/",
                        "description": `We tried to send a request to ${url} but it errored:  || error: ${error}`,
                        "footer": {
                            "text": "Website Checker."
                        },
                        "thumbnail": {
                            "url": "https://upload.wikimedia.org/wikipedia/en/b/bc/Title_screen_for_the_Netflix_series_Shadow.png" 
                        }
                    }]
                },
                json: true,
            };
            // Below is the part where we actually post the data.
            return requestPromise(option)
                .then(function() {
                    console.log("Website offline, webhook sent.");
                })
                .catch(function(err) {
                    console.error(`Error encountered whilst attempting to send webhook: ${err}.`)
                });
        }
    });
}

// Interval is set to 1 minute but you can change it to what you like I just thought 1 minute is a reasonable time.
setInterval(checkStatus, 60000, `${config.URL_CHECKED}`);
