
// https://tutorialedge.net/nodejs/reading-writing-files-with-nodejs/

const fs = require("fs");
const path = require("path");
const inlineCss = require('inline-css');
const cheerio = require('cheerio');

var fileName = process.argv[process.argv.length - 1];
if (! fileName.match(/\.(md|html)$/)) {
    console.error(fileName, "is not a valid markdown file");
    invalidFile = fileName + ".html";
    if (fs.existsSync(invalidFile)) {
        console.log(invalidFile, "is created by mistake, deleting..");
        fs.unlinkSync(invalidFile);
    }
    process.exit(1);
}

var htmlName = fileName.replace(/\.md$/, ".html");
console.log("input file:", htmlName);

var slug = htmlName.match(/[\\/]([^\\/.]*)\.html$/)[1];
var url = "https://blog.rabit.pw/2020/" + slug;
var inlinecss_options = { url , applyWidthAttributes: true, applyTableAttributes: true};

console.log("file:", htmlName, "url:", url);

function checkExistsWithTimeout(filePath, timeout) {
    return new Promise(function (resolve, reject) {

        var timer = setTimeout(function () {
            watcher.close();
            reject(new Error('File did not exists and was not created during the timeout.'));
        }, timeout);

        fs.access(filePath, fs.constants.R_OK, function (err) {
            if (!err) {
                console.log("File already exists, skip waiting");
                clearTimeout(timer);
                watcher.close();
                if (fs.statSync(filePath)["size"] === 0) {
                    console.log("file is empty, wait 2 seconds");
                    setTimeout(resolve, 2);
                }
                else {
                    resolve();
                }
            }
        });

        console.log("Waiting for file creation");
        var dir = path.dirname(filePath);
        var basename = path.basename(filePath);
        var watcher = fs.watch(dir, function (eventType, filename) {
            if (eventType === 'rename' && filename === basename) {
                clearTimeout(timer);
                watcher.close();
                if (fs.statSync(filePath)["size"] === 0) {
                    console.log("file is empty, wait 2 seconds");
                    setTimeout(resolve, 2);
                }
                else {
                    resolve();
                }
            }
        });
    });
}
checkExistsWithTimeout(htmlName, 10000).then(() => {
    fs.readFile(htmlName, { encoding: "utf8" }, function (err, html) {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        html = html.replace(/<(html|head|body)/gi, '<section id="tag-$1" ').replace(/<\/(html|head|body) /gi, "</section");
        inlineCss(html, inlinecss_options).then(function (output) {
            $ = cheerio.load(output);
            $('a').each((i, item) => { $(item).attr("data-href", $(item).attr("href")); $(item).attr("href", null); });
            $('a', '.footnotes').each((i, item) => { item.tagName = 'span' });
            output = $.html();
            fs.writeFile(htmlName, output, (err) => {
                if (err) console.log(err);
                console.log("Successfully Written to File", htmlName);
            })
        }, (err) => {console.log("inline-css error", err);});
    });
});

