<script>
    import FileComponent from "./fileExplorer.svelte";
    import TextComponent from "./textEditor.svelte";
    export let environment;
    let selectedFile;
  </script>
  
  <main>
    <div class="sidebar open">
        <!-- Sidebar content goes here -->
      <FileComponent bind:environment={environment} bind:selectedFile={selectedFile}/>
      </div>
    <div class="right-component">
    {#if selectedFile}
      <TextComponent bind:environment={environment} bind:selectedFile={selectedFile}/>
    {/if}
    </div>
  </main>
  <style>
    .sidebar {
      left: 0;
      top: 0;
      width: 10%;
      height: 100%;
      background-color: #f1f1f1;

    }
  
    .sidebar.open {
      transform: translateX(0);
    }
  
    .right-component {
      margin-left: 220px;
      padding: 20px;
    }
  </style>