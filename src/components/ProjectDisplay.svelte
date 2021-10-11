<script lang="ts">
  import codeStore from "../store/code.store";
  import Block from "./Block.svelte";
  import DiskDisplay from "./DiskDisplay.svelte";
  import ResourceDisplay from "./ResourceDisplay.svelte";
  import VMDisplay from "./VMDisplay.svelte";
  import EnvDisplay from "./EnvDisplay.svelte";
  import Droppable from "./Droppable.svelte";
  import NetworkDisplay from "./NetworkDisplay.svelte";
  import ZdbDisplay from "./ZdbDisplay.svelte";
  import MasterDisplay from "./MasterDisplay.svelte";
  import WorkerDisplay from "./WorkerDisplay.svelte";

  $: store = $codeStore;
  $: idx = store.active;
  $: project = store.projects[idx];
</script>

{#if project}
  {#if project.network}
    <Block color="--resource" removeable={false}>
      <NetworkDisplay network={project.network} />
    </Block>
  {/if}
  {#each project.resources as resource, resourceIdx (resource.id)}
    <div>
      <Droppable {resourceIdx}>
        <Block
          color="--resource"
          on:click={codeStore.removeResource.bind(codeStore, resourceIdx)}
        >
          <ResourceDisplay {resource} idx={resourceIdx} />

          {#each resource.zdbs as zdb, i (zdb.id)}
            <Block
              color="--resource"
              on:click={codeStore.removeZdb.bind(codeStore, resourceIdx, i)}
            >
              <ZdbDisplay {resourceIdx} {zdb} idx={i} />
            </Block>
          {/each}

          {#each resource.masters as master, i (master.id)}
            <Block
              color="--disks"
              on:click={codeStore.removeMaster.bind(codeStore, resourceIdx, i)}
            >
              <MasterDisplay {resourceIdx} idx={i} {master} />
            </Block>
          {/each}

          {#each resource.workers as worker, i (worker.id)}
            <Block
              color="--disks"
              on:click={codeStore.removeWorker.bind(codeStore, resourceIdx, i)}
            >
              <WorkerDisplay {resourceIdx} idx={i} {worker} />
            </Block>
          {/each}

          {#each resource.vms as vm, idx (vm.id)}
            <Droppable {resourceIdx} {idx}>
              <Block
                color="--vms"
                on:click={codeStore.removeFromResource(resourceIdx, "vms", idx)}
              >
                <VMDisplay {resourceIdx} {vm} {idx} />

                {#each vm.disks as disk, diskIdx (disk.id)}
                  <!-- Todo update remove disk error! -->
                  <Block
                    color="--disks"
                    on:click={codeStore.removeFromVm(
                      resourceIdx,
                      idx,
                      "disks",
                      diskIdx
                    )}
                  >
                    <DiskDisplay
                      {...{ resourceIdx, vmIdx: idx, idx: diskIdx, disk }}
                    />
                  </Block>
                {/each}

                {#each vm.env_vars as env, eIdx (env.id)}
                  <Block
                    color="--env_vars"
                    on:click={codeStore.removeFromVm(
                      resourceIdx,
                      idx,
                      "env_vars",
                      eIdx
                    )}
                  >
                    <EnvDisplay {resourceIdx} {env} vmIdx={idx} idx={eIdx} />
                  </Block>
                {/each}
              </Block>
            </Droppable>
          {/each}
        </Block>
      </Droppable>
    </div>
  {/each}
{:else}
  <p style="text-align: center; padding-top: 10rem; font-size: 2rem;">
    Please create or select a project.
  </p>
{/if}
