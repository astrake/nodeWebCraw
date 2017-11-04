const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
//const q_1 = require('./q-1.js');

/* process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
}); */
const argvArr = Object.values(process.argv);
console.log(argvArr[2]);
const inputJSON = fs.readFileSync(argvArr[2]);
//const inputJSON = fs.readFileSync('output-1.json');
const input = JSON.parse(inputJSON);

// data structure start
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

var day = {
    "date": "",
    "temperatureDifference": null,
    "areas": []
}
var output = [7];

var days = [7];
var temperatureDiff = [7];
for (var i = 0; i < 7; i++)
    temperatureDiff[i] = [22];
// data structure end

if (input != null && input != "") {
    for (var d = 0; d < 7; d++) {
        output[d] = {
            "date": "",
            "temperatureDifference": null,
            "areas": []
        }
        output[d].date = input[0].forcasts[d].date;
        // calculate temperature difference
        console.log(output[d].date);
        for (var p = 0; p < 22; p++) {
            temperatureDiff[d][p] = input[p].forcasts[d].dayTemperature[1] - input[p].forcasts[d].dayTemperature[0];
            //console.log(area[p] + ' ' + temperatureDiff[p][d]);
        }

        // find the area with the largest temperature difference
        var most = Math.max.apply(Math, temperatureDiff[d]);
        output[d].temperatureDifference = most;
        //console.log(most);
        for (var p = 0; p < 22; p++) {
            if (temperatureDiff[d][p] == most)
                //console.log(area[p]);
                output[d].areas.push(area[p]);
        }
    }
}

if (output != null) {
    // write to JSON file
    var file = 'output-2.json'
    var obj = JSON.stringify(output);

    fs.writeFile(file, obj, function (err) {
        if (err) {
            return console.log(err);
        }
        else {
            console.log("file saved");
        }
    });
}