const cheerio  = require('cheerio');
const chalk  = require('chalk');
const request = require('request');
request('https://www.worldometers.info/coronavirus/', fn);
function fn(error, response,body) {
    if(error){
        console.error('error:', error); // Print the error if one occurred
    }else{
        handalBody(body) // Print the HTML for the Google homepage.
    }
  }
  function handalBody(body){
    let setTool = cheerio.load(body);
    let contantArr = setTool("#maincounter-wrap span");
    let titleArr = setTool("#maincounter-wrap h1");
    let toltalT = setTool(titleArr[0]).text();
    let deathsT = setTool(titleArr[1]).text();
    let recoverT = setTool(titleArr[2]).text();
    let totalC = setTool(contantArr[0]).text();
    let deathsC = setTool(contantArr[1]).text();
    let recoverC = setTool(contantArr[2]).text();
    console.log(chalk.gray(toltalT +" "+ totalC));
    console.log(chalk.red(deathsT +" "+ deathsC));
    console.log(chalk.green(recoverT +" "+ recoverC));
  }