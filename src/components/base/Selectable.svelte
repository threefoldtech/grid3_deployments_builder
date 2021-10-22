<script lang="ts">
  export let options: string[];
  export let label: string | null = null;
  export let style: string | undefined = "margin-left: 2.5rem;";
  export let deployed: boolean = false;
</script>

<div class="selectable" {style}>
  {#if label}
    <span class="selectable__label">{label}</span>
    <span>&nbsp; <span class="keyword">=</span> &nbsp;</span>
  {/if}
  <div class="select-dropdown">
    <select on:change disabled={deployed}>
      {#each options as option}
        <option value={option}> {option} </option>
      {/each}
    </select>
  </div>
</div>

<style lang="scss" scoped>
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
      background-color: rgba(230, 230, 230, 0);
      width: auto;
      float: left;
      max-width: 100%;
      border-radius: 2px;
      select {
        font-size: 1.8rem;
        font-weight: 200;
        max-width: 100%;
        padding: 8px 24px 8px 10px;
        border: none;
        background-color: transparent;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        &:active,
        &:focus {
          outline: none;
          box-shadow: none;
        }
      }
      &:after {
        content: " ";
        position: absolute;
        top: 50%;
        margin-top: -2px;
        right: 8px;
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid #aaa;
      }
    }
  }
</style>
