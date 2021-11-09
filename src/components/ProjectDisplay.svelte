<script lang="ts">
  import codeStore from "src/store/code.store";
  import mnemonicsStore from "src/store/mnemonics.store";
  import Block from "./base/Block.svelte";
  import DiskDisplay from "./machines/DiskDisplay.svelte";
  import MachineDisplay from "./machines/MachineDisplay.svelte";
  import EnvDisplay from "./machines/EnvDisplay.svelte";
  import Droppable from "./base/Droppable.svelte";
  import NetworkDisplay from "./NetworkDisplay.svelte";
  import ZdbDisplay from "./zdbs/ZdbDisplay.svelte";
  import MasterDisplay from "./kubernetes/MasterDisplay.svelte";
  import WorkerDisplay from "./kubernetes/WorkerDisplay.svelte";
  import GatewaysFqdDisplay from "./gateways/GatewaysFQDDisplay.svelte";
  import GatewaysNameDisplay from "./gateways/GatewaysNameDisplay.svelte";
  import MachinesDisplay from "./machines/MachinesDisplay.svelte";
  import KubernetesDisplay from "./kubernetes/KubernetesDisplay.svelte";
  import ZdbsDisplay from "./zdbs/ZdbsDisplay.svelte";
  import ConfirmMsg from "./base/ConfirmMsg.svelte";
  import {
    deleteMachine,
    deleteResource,
    deleteWorker,
    deleteZdb,
  } from "src/grid3";
  import QsfsZdbsDisplay from "./zdbs/QsfsZdbsDisplay.svelte";
  import QsfsDiskDisplay from "./machines/QSFSDiskDisplay.svelte";
  import { Machine, Resource, Worker, ZDB } from "src/models";

  $: store = $codeStore;
  $: idx = store.active;
  $: project = store.projects[idx];
  $: mnemStore = $mnemonicsStore;
  
  // For Delete
  let onDelete: boolean = false;
  let deleteType: string = "element" 
  let deleteDeployment: Resource;
  let deleteDeploymentId: number;
  let deleteElement: Machine | Worker | ZDB;
  let deleteElementId: number;
  let deleteMsg: string = "";
  const onShowDelete = (delType, dep, depId, element, elementId) => {
    deleteType = delType;
    deleteElement = element;
    deleteElementId = elementId;
    deleteDeployment = dep;
    deleteDeploymentId = depId;
    if (deleteType == "resource"){
      deleteMsg = "You are about to delete " + dep.name;
    }else{
      deleteMsg = "You are about to delete " + element.name + " in " + dep.name;
      console.log(deleteMsg)
    }
    onDelete = true;
  }
  const confirmDeleteResource = (projectName) => {
    console.log(projectName, deleteDeployment.name, deleteDeploymentId, deleteElement, deleteElementId)
    if (deleteType == "resource"){
      deleteResource(mnemStore, projectName, deleteDeployment, deleteDeploymentId)
    }else{
      if (deleteDeployment.type == "machines") {
        console.log("delete machine", projectName, deleteDeployment.name, deleteDeploymentId, deleteElement.name, deleteElementId)
        deleteMachine(mnemStore, projectName, deleteDeployment.name, deleteDeploymentId, deleteElement as Machine, deleteElementId)
      }else if (deleteDeployment.type == "kubernetes"){
        deleteWorker(mnemStore, projectName, deleteDeployment.name, deleteDeploymentId, deleteElement as Worker, deleteElementId)
      }else if (deleteDeployment.type == "zdbs"){
        deleteZdb(mnemStore, projectName, deleteDeployment.name, deleteDeploymentId, deleteElement as ZDB, deleteElementId)
      }
    }
    onDelete = false;
  };
  const onCloseDelete = () => {
    onDelete = false;
  };

</script>

{#if project}
  {#if project.network}
    <Block color="--network" removeable={false}>
      <NetworkDisplay network={project.network} />
    </Block>
  {/if}
  <div class="grid__container">
    {#each project.resources as resource, resourceIdx (resource.id)}
      <div class="grid__element">
        <Droppable {resourceIdx}>
          <Block
            color="--{resource.type}"
            height="100%"
            on:click={() => {
              onShowDelete("resource", resource, resourceIdx, undefined, undefined);
            }}
          >
            <!-- ---------------- Machines ---------------- -->
            {#if "machines" in resource}
              <MachinesDisplay machines={resource} idx={resourceIdx} />
              {#each resource.machines as vm, idx (vm.id)}
                <Droppable {resourceIdx} {idx}>
                  <Block
                    color="--machine"
                    on:click={() => {
                      onShowDelete("element", resource, resourceIdx, vm, idx)
                    }}
                  >
                    <MachineDisplay {resourceIdx} {vm} {idx} />

                    {#each vm.disks as disk, diskIdx (disk.id)}
                      <Block
                        color="--disk"
                        on:click={codeStore.removeFromVm(
                          resourceIdx,
                          idx,
                          "disks",
                          diskIdx
                        )}
                        removeable={!disk.isDeployed}
                      >
                        <DiskDisplay
                          {...{ resourceIdx, vmIdx: idx, idx: diskIdx, disk }}
                        />
                      </Block>
                    {/each}

                    {#each vm.qsfsDisks as qsfsDisk, qsfsDiskIdx (qsfsDisk.id)}
                      <Block
                        color="--disk"
                        on:click={codeStore.removeFromVm(
                          resourceIdx,
                          idx,
                          "qsfsDisks",
                          qsfsDiskIdx
                        )}
                        removeable={!qsfsDisk.isDeployed}
                      >
                        <QsfsDiskDisplay
                          {...{
                            resourceIdx,
                            vmIdx: idx,
                            idx: qsfsDiskIdx,
                            qsfsDisk,
                          }}
                        />
                      </Block>
                    {/each}

                    {#each vm.env_vars as env, eIdx (env.id)}
                      <Block
                        color="--envVar"
                        on:click={codeStore.removeFromVm(
                          resourceIdx,
                          idx,
                          "env_vars",
                          eIdx
                        )}
                        removeable={!env.isDeployed}
                      >
                        <EnvDisplay
                          {resourceIdx}
                          {env}
                          vmIdx={idx}
                          idx={eIdx}
                        />
                      </Block>
                    {/each}
                  </Block>
                </Droppable>
              {/each}

              <!-- ---------------- Kubernetes ---------------- -->
            {:else if "masters" in resource}
              <KubernetesDisplay kubernetes={resource} idx={resourceIdx} />
              {#each resource.masters as master, i (master.id)}
                <Block color="--master" removeable={false}>
                  <MasterDisplay {resourceIdx} idx={i} {master} />
                </Block>
              {/each}

              {#each resource.workers as worker, i (worker.id)}
                <Block
                  color="--worker"
                  on:click={() => {
                    onShowDelete("element", resource, resourceIdx, worker, i)
                  }}
                >
                  <WorkerDisplay {resourceIdx} idx={i} {worker} />
                </Block>
              {/each}

              <!-- ---------------- ZDBs ---------------- -->
            {:else if "zdbs" in resource}
              <ZdbsDisplay zdbs={resource} idx={resourceIdx} />
              {#each resource.zdbs as zdb, i (zdb.id)}
                <Block
                  color="--zdb"
                  on:click={() => {
                    onShowDelete("element", resource, resourceIdx, zdb, i)
                  }}
                >
                  <ZdbDisplay {resourceIdx} {zdb} idx={i} />
                </Block>
              {/each}

              <!-- ---------------- Qsfs ZDBs ---------------- -->
            {:else if "qsfsZdbsType" in resource}
              <QsfsZdbsDisplay qsfsZdbs={resource} idx={resourceIdx} />

              <!-- ---------------- FQDN Gateway ---------------- -->
            {:else if "domain" in resource}
              <GatewaysFqdDisplay gatewayfq={resource} idx={resourceIdx} />

              <!-- ---------------- Name Gateway ---------------- -->
            {:else if "prefix" in resource}
              <GatewaysNameDisplay gateway={resource} idx={resourceIdx} />
            {/if}
          </Block>
        </Droppable>
      </div>

      {#if onDelete}
        <ConfirmMsg
          msg={deleteMsg}
          confirmBtnDisplayText="Delete"
          onClickConfirm={confirmDeleteResource.bind(confirmDeleteResource, project.name)}
          onClickCancel={onCloseDelete}
        />
      {/if}
    {/each}
  </div>
{:else}
  <p style="text-align: center; padding-top: 10rem; font-size: 2rem;">
    Please create or select a project.
  </p>
{/if}

<style lang="scss">
  .grid__container {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: 1fr;
    grid-auto-flow: dense;
  }

  .grid__element {
    width: 100%;
    height: 100%;
  }
</style>
