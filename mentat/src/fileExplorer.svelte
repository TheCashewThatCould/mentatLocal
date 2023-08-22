<script>
// @ts-nocheck
  class linkedList{
    constructor(path, parent, id){
      this.directories = [];
      this.files = [];
      this.id = id
      this.path = path;
      this.parent = parent;
    }
  }
  let uploadedFile;
  let uploadDirectory;
  let fileContent = ''; // Initialize the content variable
  export let environment;
  export let selectedFile;
  let headDirectory = new linkedList([], null, "core");
  let currentDirectory = headDirectory;
  function insertIntoDirectory(filePath){
    const filePathArray = filePath.split("/");
    let insertionDirectory = currentDirectory;
    console.log(insertionDirectory.directories);
    for(let i=0;i<filePathArray.length;i++){
      const fileObject = filePathArray[i]
      if(i===filePathArray.length-1){
        insertionDirectory.files = [...insertionDirectory.files, fileObject];
      }
      else{
        let index = insertionDirectory.directories.findIndex((directory) => directory.id==fileObject);
        if(index===-1){
          const newDirectory = new linkedList([...insertionDirectory.path, fileObject] , insertionDirectory, fileObject);
          insertionDirectory.directories = [...insertionDirectory.directories, newDirectory];
          insertionDirectory = newDirectory;
        }
        else{
          insertionDirectory = insertionDirectory.directories[index];
        }
      }
    }
  }
  function handleFileChange(event) {
    uploadedFile = event.target.files[0];
  }
  function handleDirectoryChange(event){
    uploadDirectory = event.target.files;
    console.log(uploadDirectory);
  }
  let selectedDirectory;
  function handleDirectoryUpload() {
    for(let i=0;i<uploadDirectory.length;i++){
      const file = uploadDirectory[i];
      const relativeFilepath = file.webkitRelativePath;
      const realFilePath = currentDirectory.path+relativeFilepath;
      insertIntoDirectory(relativeFilepath);
      //currentDirectory = currentDirectory.directories[0];
      const reader = new FileReader();
      reader.onload = function(event) {
        // @ts-ignore
        fileContent = event.target.result;
        //console.log(fileContent);
        environment[realFilePath] = fileContent;
      }
      currentDirectory.directories = [...currentDirectory.directories];
      reader.readAsText(file);
    }
  }
  function handleFileupload() {
    if (uploadedFile) {
      // Read the file content using FileReader
      const reader = new FileReader();
      reader.onload = function(event) {
        // @ts-ignore
        fileContent = event.target.result;
        environment[uploadedFile.id] = fileContent;
      };
      reader.readAsText(uploadedFile);

      // Reset the selectedFile variable after upload
    } else {
      console.log('No file selected.');
    }
  }
  function selectFile(file){
    const path = currentDirectory.path;
    selectedFile = path.join("/")+"/"+file;
    console.log(selectedFile);
  }
  function changeDirectory(directory){
    currentDirectory = directory;
  }
  /*
    {#each currentDirectory.directories as directory (directory)}
    {console.log("afe")}
    <div on:click={() => changeDirectory(directory)}>{directory.id}</div>
  {/each}
  {#each currentDirectory.files as file (file)}
    <div on:click={() => selectFile(file)}>{file}</div>
  {/each}
  */
</script>
  
<main>
  <input type="file" on:change={handleDirectoryChange} />
  <div>
    <input type="file" webkitdirectory directory on:change={handleDirectoryChange} />
    <p>Selected Directory: {selectedDirectory ? selectedDirectory.id : 'None'}</p>
  </div>
  <button on:click={handleDirectoryUpload}>Upload</button>

  <!-- Display the content of the uploaded file -->
  {#if currentDirectory.parent!==null}
    <div on:click={()=>changeDirectory(currentDirectory.parent)}>{currentDirectory.parent.id}</div>
  {/if}
  {#each currentDirectory.directories as directory (directory)}
    {console.log("afe")}
    <div on:click={() => changeDirectory(directory)}>{directory.id}</div>
  {/each}
  {#each currentDirectory.files as file (file)}
    <div on:click={() => selectFile(file)}>{file}</div>
  {/each}
</main>
  
  <style>
    /* Add your styles here */
  </style>
  