<script>
    let uploadedFile;
    let fileContent = ''; // Initialize the content variable
    export let environment;
    export let selectedFile;
    let path = "core/";
    function handleFileChange(event) {
      uploadedFile = event.target.files[0];
    }
  
    async function uploadFile() {
      if (uploadedFile) {
        // Read the file content using FileReader
        const reader = new FileReader();
        reader.onload = function(event) {
          // @ts-ignore
          fileContent = event.target.result;
          environment[path+uploadedFile.name] = fileContent;
          console.log(uploadedFile)
        };
        reader.readAsText(uploadedFile);
  
        // Reset the selectedFile variable after upload
      } else {
        console.log('No file selected.');
      }
    }
    function selectFile(file){
      selectedFile = file;
    }
  </script>
  
  <main>
    <input type="file" on:change={handleFileChange} />
    <button on:click={uploadFile}>Upload</button>
  
    <!-- Display the content of the uploaded file -->
    {#each Object.entries(environment) as [key, value]}
      {#if value!==undefined}
      <div on:click={() => selectFile(key)}>{key}</div>
      {/if}
    {/each}
  </main>
  
  <style>
    /* Add your styles here */
  </style>