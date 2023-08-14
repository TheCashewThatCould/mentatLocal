const path = require('path');
const fs = require('fs');

const executeChanges = async(environmentDir, newEnvironment, files) => {
    for(let index = 0;index<files.length;index++){
        const file = files[index];
        if(file[0]=='write'){
            fs.writeFile(path.join(environmentDir, file[1]), newEnvironment[file[1]], (err) => {
                if(err){
                    console.error(err)
                    return;
                }
                console.log(`writting to ${file[1]}`)
            })
        }
        else if(file[0]=='delete'){
            fs.unlink(path.join(environmentDir, file[1]), (err) => {
                if (err){
                    console.timeLog(err);
                    return;
                }
                console.log(`${file[1]} has been deleted`)
            })
        }
        else{
            console.log("invalid file command encountered");
        }
    }
}
const getEnvironment = async (dir, virtualDir) => {
    var fileContents = {};
    const files = await fs.promises.readdir(dir);
    for(const file of files){
        const filePath = path.join(dir, file);
        const currentVirtualDirectory = path.join(virtualDir, file);
        const stats = await fs.promises.stat(filePath);

        if(stats.isDirectory()){
            const subdirectory = await getEnvironment(filePath, currentVirtualDirectory);
            fileContents = {
                ...fileContents,
                ...subdirectory
            };
        } else if(stats.isFile()){
            const data = await fs.promises.readFile(filePath, 'utf8');
            fileContents[currentVirtualDirectory] = data;
        }
    }
    return fileContents;
}
module.exports = {getEnvironment, executeChanges}
