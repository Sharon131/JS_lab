var express = require('express');
var router = express.Router();
const fetch = require("node-fetch");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
}).get('/byCountryLive/:from/:to/:country1/:country2/:country3', function (req, res, next) {
    //2020-03-01T00:00:00Z
    function dataForCountry(country) {
        return fetch(`https://api.covid19api.com/country/${country}/status/confirmed?from=${req.params.from}&to=${req.params.to}`)
    }

    dataForCountry(req.params.country1).then(c1 => {
        c1.json().then(country1 => {
            dataForCountry(req.params.country2).then(c2 => {
                c2.json().then(country2 => {
                    dataForCountry(req.params.country3).then(c3 => {
                        c3.json().then(country3 => {
                            const casesInDate = (date, data) => {
                                const got = data.filter(e => e['Date'] == date)

                                if (got && got[0]) {
                                    return got[0]['Cases']
                                } else {
                                    return '-'
                                }
                            }

                            const dates = country1.map(e => e['Date'])
                            const records = dates.map(date => {
                                const x = {
                                    'Date': date
                                }
                                x[req.params.country1] = casesInDate(date, country1)
                                x[req.params.country2] = casesInDate(date, country2)
                                x[req.params.country3] = casesInDate(date, country3)
                                return x
                            })
                            const data = {
                                countries: [req.params.country1, req.params.country2, req.params.country3],
                                records: records
                            }
                            res.render('byCountryLive', data);
                        })
                    })
                })
            })
        })
    })
}).get('/summary/:parameter', function (req, res, next) {
    fetch('https://api.covid19api.com/summary').then(s => {
        s.json().then(data => {
            const countries = data['Countries']
            const parsedData = countries.map(e => {
                return {
                    country: e['Country'],
                    parameter: e[req.params.parameter]
                }
            }).sort((a, b) => {
                return parseInt(b.parameter) - parseInt(a.parameter)
            })

            console.log(parsedData)
            res.render('summary', {
                records: parsedData,
                parameter: req.params.parameter
            })
        })
    })
});

module.exports = router;
