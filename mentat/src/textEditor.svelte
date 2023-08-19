<script>
    import { AceEditor } from "svelte-ace";
    import "brace/mode/json";
    import "brace/theme/chrome";
    export let environment;
    export let selectedFile;
    let selectedContent = environment[selectedFile];
    function changeContent(newContent){
      console.log(selectedFile);
      selectedContent = newContent;
      environment[selectedFile] = newContent;
    }
  </script>
<div>
  <AceEditor
  on:selectionChange={(obj) => console.log(obj.detail)}
  on:paste={(obj) => console.log(obj.detail)}
  on:input={(obj) => changeContent(obj.detail)}
  on:focus={() => console.log('focus')}
  on:documentChange={(obj) => console.log(`document change : ${obj.detail}`)}
  on:cut={() => console.log('cut')}
  on:cursorChange={() => console.log('cursor change')}
  on:copy={() => console.log('copy')}
  on:init={(editor) => console.log(editor.detail)}
  on:commandKey={(obj) => console.log(obj.detail)}
  on:changeMode={(obj) => console.log(`change mode : ${obj.detail}`)}
  on:blur={() => console.log('blur')}
  width='100%'
  height='300px'
  lang="json"
  theme="chrome"
  value={environment[selectedFile]} />
</div>
  <style>
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      width: 200px;
      height: 100vh;
      background-color: #f1f1f1;
      transition: transform 0.3s ease;
      transform: translateX(-200px);
    }
  
    .sidebar.open {
      transform: translateX(0);
    }
  
    .right-component {
      margin-left: 220px;
      padding: 20px;
    }
  </style>