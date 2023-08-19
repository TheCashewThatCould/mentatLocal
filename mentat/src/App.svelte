<script>
  import CodingComponent from "./codingEnvironment.svelte";
  import CommandComponent from "./cmdWindow.svelte";
  let mainEnvironment = {};
  let tempEnvironment;
  function mergEnvironments(){
    mainEnvironment = {...tempEnvironment};
    tempEnvironment = undefined;
  }
</script>

<main>
  <div class="left">
    <CodingComponent bind:environment={mainEnvironment}/>
  </div>
  {#if tempEnvironment && tempEnvironment!==undefined}
    <div class="right">
      <CodingComponent bind:environment={tempEnvironment}/>
    </div>
  {/if}
  <div class="bottom">
    <CommandComponent bind:mainEnvironment={mainEnvironment} bind:tempEnvironment={tempEnvironment}/>
  </div>
  <div on:click={mergEnvironments}>merge</div>
</main>
<style>

  .left {
    border: 1px solid black;
    width: 50%;
    height: 75%;
    top: 0%;
    left: 0%;
  }
  .right {
    border: 1px solid black;
    width: 50%;
    height: 75%;
    top: 0%;
    right: 0%;
  }
  .bottom {
    border: 10px solid black;
    width: 100%;
    height: 25%;
    bottom: 0%
  }
</style>