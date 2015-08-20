var express = require("express"),
    app = express(),
    csvWriter = require('csv-write-stream'),
    fs = require("fs"),
    exec = require("child_process").exec;

function writeCSVFile() {
    console.log("in get");
    var data = [],
        headers = ['holdepladsnr', 'navn', 'type nr', 'type navn', 'type ikon', 'etrs89koordinat øst', 'etrs89koordinat nord', 'wgs84koordinat bredde', 'wgs84koordinat længde', 'rejseplanen herfra', 'rejseplanen hertil', 'rejseplanen herframobil', 'rejseplanen hertilmobil', 'rejseplanen afgangstavle', 'rejseplanen ankomsttavle'],
        dataUrl = "http://geo.oiorest.dk/holdepladser.json?holdepladstype=4";
    fields = ['holdepladsnr', 'navn', 'type.nr', 'type.navn', 'type.ikon', 'etrs89koordinat.øst', 'etrs89koordinat.nord', 'wgs84koordinat.bredde', 'wgs84koordinat.længde', 'rejseplanen.herfra', 'rejseplanen.hertil', 'rejseplanen.herframobil', 'rejseplanen.hertilmobil', 'rejseplanen.afgangstavle', 'rejseplanen.ankomsttavle'];
    exec('curl ' + dataUrl, {
        maxBuffer: 1024 * 10240000
    }, function(error, stdout, stderror) {
        if (!error) {
            console.log("success");
            body = JSON.parse(stdout);
            var writer = csvWriter({
                headers: headers
            });
            writer.pipe(fs.createWriteStream('rejseplanen.csv'));
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
writeCSVFile();
app.listen(process.env.PORT || 3000);
