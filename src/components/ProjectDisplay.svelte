<script lang="ts">
  import codeStore from "../store/code.store";
  import mnemonicsStore from "src/store/mnemonics.store";
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
  $: mnemStore = $mnemonicsStore;

</script>

{#if project}
  {#if project.network}
    <Block color="--network" removeable={false}>
      <NetworkDisplay network={project.network} />
    </Block>
  {/if}
  {#each project.resources as resource, resourceIdx (resource.id)}
    <div>
      <Droppable {resourceIdx}>
        <Block
          color="--{resource.type}"
          on:click={codeStore.removeResource.bind(codeStore, resourceIdx, mnemStore)}
        >
          <ResourceDisplay {resource} idx={resourceIdx} />

          {#each resource.zdbs as zdb, i (zdb.id)}
            <Block
              color="--zdb"
              on:click={codeStore.removeZdb.bind(codeStore, resourceIdx, i, mnemStore)}
            >
              <ZdbDisplay {resourceIdx} {zdb} idx={i} />
            </Block>
          {/each}

          {#each resource.masters as master, i (master.id)}
            <Block
              color="--master"
              on:click={codeStore.removeMaster.bind(codeStore, resourceIdx, i)}
              removeable = {!master.isDeployed}
            >
              <MasterDisplay {resourceIdx} idx={i} {master} />
            </Block>
          {/each}

          {#each resource.workers as worker, i (worker.id)}
            <Block
              color="--worker"
              on:click={codeStore.removeWorker.bind(codeStore, resourceIdx, i, mnemStore)}
            >
              <WorkerDisplay {resourceIdx} idx={i} {worker} />
            </Block>
          {/each}

          {#each resource.vms as vm, idx (vm.id)}
            <Droppable {resourceIdx} {idx}>
              <Block
                color="--vms"
                on:click={codeStore.removeVM.bind(codeStore, resourceIdx, idx, mnemStore)}
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
                    removeable = {!disk.isDeployed}
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
                    removeable = {!env.isDeployed}
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
