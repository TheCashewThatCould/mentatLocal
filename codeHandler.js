const fs = require("fs");
const path = require('path');
const {getEnvironment, executeChanges} = require('./fileHandler');
const {APIhandler, initPrompt} = require("./apiHandler")
var environmentDir;
var environment;
var fileChanges = [];
const changeCode = (changes) => {
    const {dir, action} = changes;
    if(action=="delete"){
        fileChanges.push(["delete", dir]);
    }
    else if(action=="create-file"){
        environment[dir] = "";
        fileChanges.push(["write", dir]);
    }
    else if(action=="delete"){
        var contentArray = environment[dir].split('\n');
        contentArray.splice(changes.start, changes.end);
        environment[dir] = contentArray.join('\n');
        fileChanges.push(["write", dir]);
    }
    else if (action=="insert"||action=="replace"){
        var contentArray = environment[dir].split('\n');
        var changesArray = changes.code.split('\n')
        if(action=="insert"){
            contentArray.splice(changes.start, 0,...changesArray);
        }
        else if(acton=="replace"){
            contentArray.splice(changes.start, changes.end);
            contentArray.splice(changes.start, 0,...codeChanges);
        }
        else{
            console.log("invalid action");
            return
        }
        fileChanges.push(["write", dir]);
        environment[dir] = contentArray.join('\n');
    }
    else{
        console.log("invalid action");
    }
}
const parseRequest = (message) => {
    message = message.replace(/\r/g, '');
    const contentArray = message.split('\n');
    const changes = [];
    var current = {};
    var curString = "";
    var state = 0;
    for(let i=0;i<contentArray.length;i++){
        const line = contentArray[i];
        if(state==0){
            if(line=="@@start"){
                state=1;
                console.log("entering state 1");
            }
        }
        else if(state==1){
            if(line=="@@end"){
                current = JSON.parse(curString);
                curString="";
                console.log("entering state 1")
                changes.push(current);
                current={};
                state = 0;
            }
            else if(line=="@@code"){
                current = JSON.parse(curString);
                curString="";
                console.log("entering state 2")
                state = 2;
            }
            else{
                curString+=line;
            }
        }
        else if(state==2){
            if(line=="@@end"){
                current = {
                    ...current,
                    code:curString
                }
                changes.push(current);
                state=0;
                curString="";
                current={};
                console.log("entering state 0")
            }
            else{
                curString=line+'\n';
            }
        }
        else{
            console.log("invalid state reached when parsing request");
        }
        console.log(changes);
    }
}
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const getInput = async () => {
    rl.question('Enter something (or type "exit" to stop): ', (answer) => {
        if (answer === 'exit') {
            rl.close();
        } else {
            APIhandler(answer);
            getInput();
        }
    });
}

const main = async() => {
    environmentDir = path.join(__dirname, 'test_dir')
    environment = await(getEnvironment(environmentDir, ""))
    await initPrompt(environment);
    const request = await APIhandler("convert server.py into a webserver backend");
    const changes = await parseRequest(request);
    await changeCode(changes);
    executeChanges(environmentDir, environment, fileChanges);
    /*
    const data = await fs.promises.readFile("prompt.txt", 'utf8');
    let text_input = data.trim();
    text_input = text_input.replace(/\r/g, '');    
    const pattern = /\n/g;
    text_input = text_input.replace(pattern, '\\n');
    console.log(text_input);*/
}
main();