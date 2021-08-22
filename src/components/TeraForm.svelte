<script lang="ts">
  import codeStore from "../store/code.store";
  import Block from "./Block.svelte";
  import DiskDisplay from "./DiskDisplay.svelte";
  import ResourceDisplay from "./ResourceDisplay.svelte";
  import VMDisplay from "./VMDisplay.svelte";
  import MountDisplay from "./MountDisplay.svelte";
  import EnvDisplay from "./EnvDisplay.svelte";

  $: resource = $codeStore;
</script>

<Block color="--resource">
  <ResourceDisplay {resource} />

  {#each resource.disks as disk (disk.id)}
    <Block color="--disks">
      <DiskDisplay {disk} />
    </Block>
  {/each}

  {#each resource.vms as vm (vm.id)}
    <Block color="--vms">
      <VMDisplay {vm} />

      {#each vm.mounts as mount (mount.id)}
        <Block color="--mounts">
          <MountDisplay {mount} />
        </Block>
      {/each}

      {#each vm.env_vars as env (env.id)}
        <Block color="--env_vars">
          <EnvDisplay {env} />
        </Block>
      {/each}
    </Block>
  {/each}
</Block>
