<script lang="ts">
  import { onMount } from "svelte";
  export let value: string | number | null = null;
  export let type: "number" | "text" | "password" = "text";
  export let label: string | null = null;
  export let unit: string | null = null;
  export let style: string | undefined = "margin-left: 2.5rem;";
  export let placeholder: string = "";
  export let deployed: boolean = false;
  export let min: number = 0;
  let max_width : number = 500;

  let fake_span: HTMLSpanElement;
  let width = 100;

  function updateWidth() {
    if (!fake_span) return;
    width = fake_span.offsetWidth > max_width ?  max_width : fake_span.offsetWidth;
  }

  onMount(updateWidth);

  function autoSelect() {
    this.select();
  }
</script>

<div class="editable" {style}>
  {#if label}
    <span class="editable__label">{label + ":"}</span>
  {/if}
  {#if value !== null}
    <span class="editable__fake" bind:this={fake_span}>
      {value || placeholder}
    </span>
    <input
      {type}
      {value}
      {placeholder}
      min={min}
      style={`width: ${width}px`}
      on:input
      on:keydown={updateWidth}
      on:click={autoSelect}
      disabled={deployed}
    />
  {:else}
    <slot />
  {/if}
  {#if unit}
    <span class="editable__unit">{unit}</span>
  {/if}
</div>

<style lang="scss" scoped>
  .editable {
    display: flex;
    margin: 1rem 0;
    align-items: center;

    &__label {
      font-size: 1.8rem;
      text-transform: capitalize;
      padding-right: 1rem;
    }

    &__unit {
      font-size: 1.8rem;
      padding-left: 1rem;
      color: gray;
    }

    &__fake {
      font-size: 1.8rem;
      visibility: hidden;
      pointer-events: none;
      height: 0;
      overflow: hidden;
      transform: scale(0);
      position: absolute;
      padding: 1.5rem;
    }

    input {
      font-size: 1.8rem;
      outline: none;
      border: none;
      background: none;
      padding: 0.5rem 0;
      text-align: center;
      border-bottom: 0.1rem solid var(--sidenav-border);

      &:focus {
        border-bottom-color: var(--black);
      }
    }
  }
</style>
