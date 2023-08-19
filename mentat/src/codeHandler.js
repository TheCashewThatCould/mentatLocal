export const codeHandler = (environment, message) => {
    const changes = parseRequest(message);
    return changeCode(environment, changes);
}
const changeCode = (oldEnvironment, changes) => {
    const environment = {...oldEnvironment};
    console.log(environment);
    for(let i=0;i<changes.length;i++){
        const change = changes[i];
        const {file, action} = change;
        if(action=="delete"){
            environment[file] = undefined;
        }
        else if(action=="create-file"){
            environment[file] = "";
        }
        else if(action=="delete"){
            var contentArray = environment[file].split('\n');
            contentArray.splice(change.start, change.end);
            environment[file] = contentArray.join('\n');
        }
        else if (action=="insert"||action=="replace"){
            var contentArray = environment[file].split('\n');
            var changesArray = change.code.split('\n')
            if(action=="insert"){
                contentArray.splice(change.start, 0,...changesArray);
            }
            else if(action=="replace"){
                contentArray.splice(change.start, change.end);
                contentArray.splice(change.start, 0,...changesArray);
            }
            else{
                console.log("invalid action");
                return
            }
            environment[file] = contentArray.join('\n');
        }
        else{
            console.log("invalid action");
        }
    }
    console.log(environment);
    return environment;
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
                //console.log("entering state 1");
            }
        }
        else if(state==1){
            if(line=="@@end"){
                current = JSON.parse(curString);
                curString="";
                //console.log("entering state 1")
                changes.push(current);
                current={};
                state = 0;
            }
            else if(line=="@@code"){
                current = JSON.parse(curString);
                curString="";
                //console.log("entering state 2")
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
                //console.log("entering state 0")
            }
            else{
                curString=line+'\n';
            }
        }
        else{
            //console.log("invalid state reached when parsing request");
        }
        //console.log(changes);
    }
    console.log(changes);
    return changes;
}