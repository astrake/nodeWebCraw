const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

// URL start
const u1 = 'http://www.cwb.gov.tw/V7e/forecast/taiwan/inc/city/';
const u2 = '.htm';
const area = [
    "Changhua_County",
    "Chiayi_City",
    "Chiayi_County",
    "Hsinchu_City",
    "Hsinchu_County",
    "Hualien_County",
    "Kaohsiung_City",
    "Keelung_City",
    "Kinmen_County",
    "Lienchiang_County",
    "Miaoli_County",
    "Nantou_County",
    "New_Taipei_City",
    "Penghu_County",
    "Pingtung_County",
    "Taichung_City",
    "Tainan_City",
    "Taipei_City",
    "Taitung_County",
    "Taoyuan_City",
    "Yilan_County",
    "Yunlin_County"
];

const urls = [22];
for (var i = 0; i < 22; i++) {
    urls[i] = u1 + area[i] + u2;
}
// URL end

// data structure start
var results = [22];
var dcount = 0;
var today = new Date();
var year = today.getFullYear();
// data structure end

// get and parse Data
for (var i = 0; i < 22; i++) {
    getData(i);
}


function getData(p) {
    request(urls[p], function (err, res, body) {
        // 去跟中央氣象局的網站要資料

        var $ = cheerio.load(body);
        // 把要到的資料放進 cheerio

        var date = [7];
        for (var i = 0; i < 7; i++) {
            $('.FcstBoxTable01 thead th').each(function (i, elem) {
                date[i] = $(this).text().split('\n');
            });
        }

        var temperature = [14];
        for (var i = 0; i < 14; i++) {
            $('.FcstBoxTable01 tbody td').each(function (i, elem) {
                temperature[i] = $(this).text().split('\n');
            });
        }

        var forcasts = [7];
        for (var i = 0; i < 7; i++) {
            forcasts[i] = {
                "date": year + "-" + date[i + 1][0].replace("/", "-").slice(0, -4),
                "dayTemperature": [parseInt(temperature[i][2].substring(5).split('~')[0].trim(), 10), parseInt(temperature[i][2].substring(5).split('~')[1].trim(), 10)],
                "nightTemperature": [parseInt(temperature[i + 7][2].substring(5).split('~')[0].trim(), 10), parseInt(temperature[i + 7][2].substring(5).split('~')[1].trim(), 10)],
            };
            dcount++;
        }
        results[p] = {
            "area": date[0][0],
            "forcasts": forcasts
        };
        saveFile(p);
    });
    if (p >= 21)
        console.log("getData end");
}

function saveFile(p) {
    if (p >= 21 && dcount == 154) {

        console.log("request end with result " + results.length);// + dcount + "days.");
        if (results.length == 22) {
            // write to JSON file
            var file = 'output-1.json'
            var obj = JSON.stringify(results);

            fs.writeFile(file, obj, function (err) {
                if (err) {
                    return console.log(err);
                }
                else {
                    console.log("file saved");
                }
            });
        }
        else {
            saveFile(p);//exceed call stack limit
        }
    }
}