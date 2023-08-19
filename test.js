const changeCode = (environment, changes) => {
    const {dir, action} = changes;
    if(action=="delete"){
        environment[dir] = undefined;
    }
    else if(action=="create-file"){
        environment[dir] = "";
    }
    else if(action=="delete"){
        var contentArray = environment[dir].split('\n');
        contentArray.splice(changes.start, changes.end);
        environment[dir] = contentArray.join('\n');
    }
    else if (action=="insert"||action=="replace"){
        var contentArray = environment[dir].split('\n');
        var changesArray = changes.code.split('\n')
        if(action=="insert"){
            contentArray.splice(changes.start, 0,...changesArray);
        }
        else if(action=="replace"){
            contentArray.splice(changes.start, changes.end);
            contentArray.splice(changes.start, 0,...changesArray);
        }
        else{
            console.log("invalid action");
            return
        }
        environment[dir] = contentArray.join('\n');
    }
    else{
        console.log("invalid action");
    }
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
    return changes;
}
const message ='@@start\n'+
'{\n'+
'    "file": "core/script.py",\n'+
'    "action": "insert",\n'+
'    "insert-after-line": 3,\n'+
'    "insert-before-line": 4\n'+
'}\n'+
'@@code\n'+
'    if name == "Bob":\n'+
'        print("Nice to see you again!")\n'+
'@@end\n'+
'@@start\n'+
'{\n'+
'    "file": "core/utils.py",\n'+
'    "action": "create-file"\n'+
'}\n'+
'@@code\n'+
'def get_name():\n'+
'    return input("Enter your name: ")\n'+
'@@end\n'+
'@@start\n'+
'{\n'+
'    "file": "core/script.py",\n'+
'    "action": "insert",\n'+
'    "insert-after-line": 0,\n'+
'    "insert-before-line": 1\n'+
'}\n'+
'@@code\n'+
'from core.utils import get_name\n'+
'@@end\n'+
'@@start\n'+
'{\n'+
'    "file": "core/script.py",\n'+
'    "action": "replace",\n'+
'    "start-line": 10,\n'+
'    "end-line": 10\n'+
'}\n'+
'@@code\n'+
'def main():\n'+
'    name = get_name()\n'+
'@@end\n'+
'@@start\n'+
'{\n'+
'    "file": "core/script.py",\n'+
'    "action": "delete",\n'+
'    "start-line": 13,\n'+
'    "end-line": 13\n'+
'}\n'+
'@@end\n'+
'@@start\n'+
'{\n'+
'    "file": "core/hello_world.py",\n'+
'    "action": "delete-file"\n'+
'}\n'+
'@@end'; 
const changes = parseRequest(message);
return changeCode(environment, changes);