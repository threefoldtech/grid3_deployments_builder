<script lang="ts">
  export let options: string[];
  export let label: string | null = null;
  export let style: string | undefined = `margin-left: 2.5rem;`;
  export let lastSelected: string = options[0]
  export let deployed: boolean = false;

  let customStyle:string = "";
  if (label){
    customStyle = `width: auto;
    border-bottom: 1px solid gray;
    `
  }else{
    customStyle = `width: 100%;
    border: 1px solid gray;
    border-radius: 8px;
    `
  }
</script>

<div class="selectable" {style}>
  {#if label}
    <span class="selectable__label">{label}:</span>
  {/if}
  <div class="select-dropdown" style={customStyle}>
    <select on:change disabled={deployed} bind:value={lastSelected}>
      {#each options as option}
        <option value={option}>{option}</option>
      {/each}
    </select>
  </div>
</div>

<style lang="scss">
  .selectable {
    display: flex;
    margin: 1rem 0;
    align-items: center;

    &__label {
      font-size: 1.8rem;
      text-transform: capitalize;
    }
    .select-dropdown {
      position: relative;
      display: block;
      background-color: transparent;
      z-index: 10;
    }
    .select-dropdown select {
      border: none;
      outline: none;
      background: transparent;
      display: block;
      width: 100%;
      padding: 12px 55px 15px 15px;
      font-size: 1.8rem;
      color: black;
    }
  }
</style>
