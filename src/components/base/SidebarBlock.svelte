<script lang="ts">
  export let label: string;
  export let img: string;
  export let type:string;
  export let level: string;
  const marginLeft = +level;
</script>

<div
  class="block"
  draggable="true"
  style={
  "border-color: var(--" + type + ");" +
  "margin-left:" + marginLeft + "rem;"
  }
  on:dragstart={(e) => e.dataTransfer.setData("data", type)}
  on:click
>
  <img src= {img} alt={label} title={label} />
  <p>{label}</p>
</div>

<style lang="scss" scoped>
  .block {
    border-left: 1rem solid;
    border-right: 1rem solid;
    border-radius: 1rem;
    margin-bottom: 1.5rem;
    padding: 2rem 0;
    display: flex;
    justify-content: left;
    align-items: center;
    cursor: pointer;
    height: 60px;

    p {
      text-transform: capitalize;
      color: var(--black);
      font-size: 2rem;
    }
    
    img {
      padding: 0.5rem;
      width: 50;
      height: 50px;
    }
  }
</style>
