var express = require("express"),
    app = express(),
    csvWriter = require('csv-write-stream'),
    fs = require("fs"),
    exec = require("child_process").exec;

function writeCSVFile(dataUrl, dataIndex) {
    var data = [],
        headers = ['holdepladsnr', 'navn', 'type nr', 'type navn', 'type ikon', 'etrs89koordinat øst', 'etrs89koordinat nord', 'wgs84koordinat bredde', 'wgs84koordinat længde', 'rejseplanen herfra', 'rejseplanen hertil', 'rejseplanen herframobil', 'rejseplanen hertilmobil', 'rejseplanen afgangstavle', 'rejseplanen ankomsttavle'],
        fields = ['holdepladsnr', 'navn', 'type.nr', 'type.navn', 'type.ikon', 'etrs89koordinat.øst', 'etrs89koordinat.nord', 'wgs84koordinat.bredde', 'wgs84koordinat.længde', 'rejseplanen.herfra', 'rejseplanen.hertil', 'rejseplanen.herframobil', 'rejseplanen.hertilmobil', 'rejseplanen.afgangstavle', 'rejseplanen.ankomsttavle'];
    dataIndex = dataIndex + 1;
    exec('curl ' + dataUrl, {
        maxBuffer: 1024 * 10240000
    }, function(error, stdout, stderror) {
        if (!error) {
            console.log("success", dataIndex);
            body = JSON.parse(stdout);
            var writer = csvWriter({
                headers: headers
            });
            writer.pipe(fs.createWriteStream('rejseplanen_' + dataIndex + '.csv'));
            body.forEach(function(item, itemIndex) {
                data = [];
                fields.forEach(function(fieldName, index) {
                    if (eval('item.' + fieldName)) {
                        data.push(eval('item.' + fieldName));
                    } else {
                        data.push('');
                    }
                })
                writer.write(data);
            })

            writer.end()
        } else {
            console.log(error, stderror);
        }
    })
}

function loadData() {
    var dataUrls = ['http://geo.oiorest.dk/holdepladser.json?holdepladstype=1', 'http://geo.oiorest.dk/holdepladser.json?holdepladstype=2', 'http://geo.oiorest.dk/holdepladser.json?holdepladstype=3', 'http://geo.oiorest.dk/holdepladser.json?holdepladstype=4'];
    dataUrls.forEach(function(url, index) {
        console.log("loading data from", url);
        writeCSVFile(url, index);
    })
}
loadData();
app.listen(process.env.PORT || 3000);
