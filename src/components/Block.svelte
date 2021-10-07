<script lang="ts">
  export let color: string;
  export let removeable: boolean = true;

  $: style = `
    border-left-color: var(${color});
    background-color: var(${color}-bg);
  `;
</script>

<div class="block" {style}>
  {#if removeable}
    <button class="block__remove" on:click>
      <span />
      <span />
    </button>
  {/if}
  <slot />
</div>

<style lang="scss" scoped>
  .block {
    padding: 2rem;
    padding-left: 4rem;
    border-left: 0.5rem solid transparent;
    margin-bottom: 1rem;
    position: relative;
    &__remove {
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
      outline: none !important;
      background: none;
      border: none;

      > span {
        transition: transform 0.3s ease;
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        height: 0.3rem;
        width: 20px;
        background-color: var(--black);
        transform: rotate(45deg);

        &:nth-of-type(2) {
          transform: rotate(-45deg);
        }
      }

      &:hover {
        > span {
          transform: rotate(30deg);

          &:nth-of-type(2) {
            transform: rotate(-30deg);
          }
        }
      }
    }
  }
</style>
