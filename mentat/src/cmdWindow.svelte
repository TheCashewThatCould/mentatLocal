<script>
    import {codeHandler} from "./codeHandler";
    export let mainEnvironment;
    export let tempEnvironment;
    let messages = [];
    let cmdInput = "";
    async function handleEnterKey(event){
    if (event.key === 'Enter') {
        const url = 'http://localhost:3000/';
        const data = {
            message: cmdInput + '\n' + JSON.stringify(mainEnvironment)
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
            const message = result.message;
            tempEnvironment = codeHandler(mainEnvironment, message);
            console.log(tempEnvironment);
        })
        .catch(error => {
            console.error('Error:', error);
        }); 
    }
}
  </script>

    <div id="terminal" >      
        <section id="terminal__body">
        {#each messages as message} 
        <div id="terminal__prompt">
            <span id="terminal__prompt--location">~</span>
            <span id="terminal__prompt--bling">$ {message}</span>
        </div>
        {/each}
        <div id="terminal__prompt">
            <span id="terminal__prompt--location">~</span>
            <input id="terminal__prompt--bling" type="text" on:keydown={handleEnterKey} bind:value={cmdInput} class="text-input" style="width: 75%"/>
        </div>
        </section>      
    </div>
