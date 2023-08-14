const fs = require('fs');
const initPrompt = async(environment) => {
    const prompt = "how is your day";
    console.log("User: "+prompt);
    console.log(await APIhandler(prompt));
    
    let environmentString = "";
    for(const [key,value] of Object.entries(environment)){
        environmentString+=key+"\n"+value;
    }
    console.log("User: "+environmentString)
    console.log(await APIhandler(environmentString));
}
const APIhandler = async (message) => {
    const url = 'http://localhost:3000/';
    const data = {
        message: message
    };

    await fetch(url, {
        method: 'POST', // HTTP method
        headers: {
            'Content-Type': 'application/json' // Specify content type
        },
        body: JSON.stringify(data) // Convert data to JSON string
    })
    .then(response => response.json())
    .then(result => {
        return result.choices[0].message.content;
    })
    .catch(error => {
        console.error('Error:', error);
    }); 
}

module.exports = {APIhandler, initPrompt}