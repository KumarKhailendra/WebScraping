const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

function processScorecard(url){
    request(url, cb);
}
function cb(error, res, html){
    if(error){
        console.log(error);
    }else{
        extractMatchDetails(html);
    }
}

function extractMatchDetails(html){
    let $ = cheerio.load(html);
    let desElem = $(".ds-text-tight-m.ds-font-regular.ds-text-typo-mid3");
    let resElem = $(".ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo span");
    let innings = $(".ds-rounded-lg.ds-mt-2 .ds-w-full.ds-bg-fill-content-prime.ds-overflow-hidden.ds-rounded-xl.ds-border.ds-border-line.ds-mb-4");
    let vdStrindArr = $(desElem[0]).text().split(",");
    let vanue = vdStrindArr[1].trim();
    let date = vdStrindArr[2].trim();
    let result = resElem.text()
    for(let i = 0; i < innings.length; i++){
        let teamDelail = [];
        let teamName = $(innings[i]).find(".ds-text-title-xs.ds-font-bold.ds-capitalize").text();
        let opponentIndex = i == 0 ? 1 : 0;
        let opponentName = $(innings[opponentIndex]).find(".ds-text-title-xs.ds-font-bold.ds-capitalize").text().trim();
        let cInnings = $(innings[i]);
        let allRow = $(cInnings).find(".ci-scorecard-table tbody tr");
        for(let j = 0; j < allRow.length-4; j++){
            let rowDidden = $(allRow[j]).hasClass("ds-hidden")
            let objTable = {PlayerName: '', Run: '', Balls: '', fours: '', Sixs: '', Sr: ''};
            if(rowDidden === false){
                let allCol = $(allRow[j]).find("td");
                if($(allCol[2]).html() === null){
                    continue
                }
                let playerName = $(allCol[0]).text().trim();
                let run = $(allCol[2]).text().trim();
                let balls = $(allCol[3]).text().trim();
                let fours = $(allCol[5]).text().trim();
                let sixs = $(allCol[6]).text().trim();
                let sr = $(allCol[7]).text().trim();
                objTable.PlayerName = playerName
                objTable.Run = run
                objTable.Balls = balls
                objTable.fours = fours
                objTable.Sixs = sixs
                objTable.Sr = sr
                teamDelail.push(objTable);
                processPlayer(teamName,playerName, run, balls, fours, sixs, sr,opponentName, vanue, date,result);
            }
        }
        console.log(`${vanue} | ${date} | ${teamName} | ${opponentName} | ${result}`)
        console.table(teamDelail);

    }

}

function processPlayer(teamName,playerName, run, balls, fours, sixs, sr,opponentName, vanue, date,result){
    let teamPath = path.join(__dirname, "ipl", teamName);
    dirCreater(teamPath);
    let filePath = path.join(teamPath, playerName + ".xlsx");
    let content = excelReader(filePath, playerName);
    let objContent = {
        teamName,playerName, run, balls, fours, sixs, sr,opponentName, vanue, date,result
    }
    content.push(objContent);
    excelWriter(filePath, content, playerName);
}

function dirCreater(filePath){
    if(fs.existsSync(filePath) == false){
        fs.mkdirSync(filePath);
    }
}

function excelWriter(filePath, json, sheetName){
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, filePath);
}

function excelReader(filePath, sheetName){
    if(fs.existsSync(filePath) == false){
        return [];
    }
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_add_json(excelData);
    return ans;
}

module.exports = {
    ps: processScorecard
}