<script lang="ts">
  import Editable from "./Editable.svelte";

  export let label: string = "";
  export let deployed: boolean = false;
  export let checked: boolean = false;
  export let color:string = "--black";
  let style:string = `--checkedColor: var(${color})`;
</script>

<Editable {label} {deployed}>
  <input
    class="cb-toggle"
    type="checkbox"
    {checked}
    on:change
    disabled={deployed}
    {style}
  />
</Editable>

<style lang="scss">
  /* Toggle Button */
  .cb-toggle {
    -webkit-appearance: none;
    -webkit-tap-highlight-color: transparent;
    position: relative;
    border: 0;
    outline: 0;
    cursor: pointer;
    margin: 10px;
  }

  /* To create surface of toggle button */
  .cb-toggle:after {
    content: "";
    width: 50px;
    height: 25px;
    display: inline-block;
    background: rgba(0, 0, 0);
    border-radius: 18px;
    clear: both;
  }

  /* Contents before checkbox to create toggle handle */
  .cb-toggle:before {
    content: "";
    width: 15px;
    height: 15px;
    display: block;
    position: absolute;
    top: 5px;
    left: 5px;
    // left: -3px;
    // top: -3px;
    border-radius: 50%;
    background: rgb(255, 255, 255);
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);
  }

  /* Shift the handle to left on check event */
  .cb-toggle:checked:before {
    left: 30px;
    box-shadow: -1px 1px 3px rgba(0, 0, 0, 0.6);
  }
  /* Background color when toggle button will be active */
  .cb-toggle:checked:after {
    background: var(--checkedColor);
  }
</style>
