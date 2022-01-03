<script lang="ts">
  import { Project } from "src/models";
  import { onMount } from "svelte";
  import { addErrorNotification } from "src/store/notification.store";
  import Select from "svelte-select";

  export let project: Project;
  export let lastSelectedValue: string | number | string[] | number[] = null;
  export let deployed: boolean = false;
  export let isMulti = false;
  export let resources: {} = {
    cru: 0,
    sru: 0,
    mru: 0,
    hru: 0,
    publicIPs: false,
    gateway: false,
  };

  const width = isMulti ? "250px" : "150px";

  let selectedNode: string | string[];
  let selectedCountry: string;
  let selectedFarm: string;

  if (Array.isArray(lastSelectedValue)) {
    if (lastSelectedValue.length > 0) {
      selectedNode = [...lastSelectedValue.map((v) => v.toString())];
    }
  } else {
    if (!(lastSelectedValue === 0 || lastSelectedValue === "")) {
      selectedNode = lastSelectedValue.toString();
    }
  }
  let _grid_client;
  let nodes: any[] = [];
  $: nodesList = [];
  $: countriesList = [];
  $: farms = {};
  $: farmsList = [];
  let farmsIdList = [];
  let farmsPerCountry = {};
  let filters = {
    country: "",
    farmName: "",
    cru: 0,
    sru: 0,
    mru: 0,
    hru: 0,
    publicIPs: false,
    gateway: false,
  };
  $: errorMsg = "";
  $: doneMsg = "";
  let isChecking = true;
  let enableFilters: boolean = false;

  const initNodes = async () => {
    nodes = await project.gridClient.capacity.filterNodes();
    countriesList = ["", ...new Set(nodes.map((n) => n.country))];
    farmsIdList = [...new Set(nodes.map((n) => n.farmId))];
    (await project.gridClient.capacity.getAllFarms())
      .filter((f) => farmsIdList.includes(f.farmId))
      .map((f) => (farms[f.farmId] = f.name));

    farmsPerCountry[""] = new Set(["", ...Object.values(farms)]);
    nodes.forEach((n) => {
      if (!farmsPerCountry[n.country]) {
        farmsPerCountry[n.country] = new Set([""]);
      }
      farmsPerCountry[n.country].add(farms[n.farmId]);
    });
  };

  function updateFilter(e: Event, key: string) {
    if (key === "country") {
      filters.country = e["detail"].value;
      farmsList = [...farmsPerCountry[filters.country]];
    } else if (key === "farmName") {
      filters.farmName = e["detail"].value;
    }
  }

  const showFilters = () => {
    enableFilters = true;
  };

  const hideFilters = () => {
    enableFilters = false;
  };

  const confirmFilters = () => {
    isChecking = true;
    hideFilters();
    _grid_client = project.gridClient;
    filters.cru = resources["cru"];
    filters.mru = resources["mru"] / 1024;
    filters.sru = resources["sru"];
    filters.hru = resources["hru"];
    filters.publicIPs = resources["publicIPs"];
    filters.gateway = resources["gateway"];
    project.gridClient.capacity
      .filterNodes(filters)
      .then((ns) => {
        isChecking = false;
        errorMsg = "";
        nodesList = ns.map((n) => n.nodeId).sort((a, b) => a - b);
        doneMsg = "Found " + nodesList.length + " nodes valid";
      })
      .catch((e) => {
        isChecking = false;
        errorMsg = "No valid nodes";
        doneMsg = "";
        addErrorNotification(e);
        nodesList = [];
      });
  };

  const refreshNodes = async () => {
    await initNodes();
    confirmFilters();
  };

  onMount(async () => {
    await initNodes();
    filters.country = countriesList[0];
    farmsList = [...farmsPerCountry[filters.country]];
    filters.farmName = farmsList[0];
    confirmFilters();
  });

  $: {
    if (!isChecking && project.gridClient !== _grid_client) {
      _grid_client = project.gridClient;
      refreshNodes();
    } else if (
      isChecking === false &&
      (filters.cru !== resources["cru"] ||
        filters.hru !== resources["hru"] ||
        filters.mru !== resources["mru"] / 1024 ||
        filters.sru !== resources["sru"] ||
        filters.publicIPs !== resources["publicIPs"] ||
        filters.gateway !== resources["gateway"])
    ) {
      refreshNodes();
    }
  }
</script>

{#if nodes && farms}
  <div
    class="node_id"
    title="Resources validation is calculated for each element separately"
  >
    <div class="select__div__row">
      <span class="select__label">Node:</span>
      <div class="select__div__row__menu" style="width: {width}">
        <Select
          items={nodesList}
          bind:value={selectedNode}
          on:select
          isDisabled={deployed}
          {isMulti}
        />
      </div>
      <button class="refresh" on:click={refreshNodes}>
        <img src="/assets/refresh.png" alt="refresh nodes" />
      </button>
      <button class="filter" on:click={showFilters}>
        <img src="/assets/filter.png" alt="filter nodes" />
      </button>
      {#if isChecking}
        <img class="loading" src="/assets/loading1.gif" alt="Checking" />
      {:else}
        {#if errorMsg}
          <p class="error">{errorMsg}</p>
        {/if}
        {#if doneMsg}
          <p class="done">{doneMsg}</p>
        {/if}
      {/if}
    </div>
  </div>

  <!-- Country and Farm Filters -->
  {#if enableFilters}
    <div class="filters">
      <div class="filters__body">
        <div class="select__div__column">
          <span class="select__label">Country</span>
          <Select
            items={countriesList}
            bind:value={selectedCountry}
            on:select={(e) => {
              updateFilter(e, "country");
            }}
            placeholder={filters.country}
          />
        </div>
        <div class="select__div__column">
          <span class="select__label">Farm</span>
          <Select
            items={farmsList}
            bind:value={selectedFarm}
            on:select={(e) => {
              updateFilter(e, "farmName");
            }}
            placeholder={filters.farmName}
          />
        </div>
        <div class="filters__body__actions">
          <button class="btn btn-cancel" on:click={hideFilters}>Close</button>
          <button class="btn btn-confirm" on:click={confirmFilters}
            >Confirm</button
          >
        </div>
      </div>
    </div>
  {/if}
{/if}

<style lang="scss">
  .node_id {
    display: flex;
    flex-direction: column;
    align-content: center;
    // margin-left: 2.5rem;
    // align-items: center;

    button {
      background: transparent;
      border: none;
      cursor: pointer;
    }

    img {
      width: 30px;
      margin-left: 2.5rem;
    }

    .error {
      color: red;
      font-size: 1.5rem;
      padding-left: 1rem;
    }

    .done {
      color: green;
      font-size: 1.5rem;
      padding-left: 1rem;
    }

    .loading {
      width: 70px;
    }
  }

  .btn {
    border: none;
    border-radius: 0.5rem;
    background-color: transparent;
    font-weight: bold;
    cursor: pointer;
    font-size: 1.5rem;
    padding: 1rem 2rem;
    color: white;

    &-cancel {
      background-color: red;
      margin-right: 1rem;
    }

    &-confirm {
      background-color: green;
    }
  }

  .select {
    &__div {
      &__column {
        display: flex;
        flex-direction: column;
        padding: 1rem;
      }

      &__row {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-left: 2.5rem;
        &__menu {
          padding: 0.5rem;
        }
      }
    }
    &__label {
      font-size: 1.8rem;
    }
  }
  .filters {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(#333, 0.3);

    &__body {
      background-color: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      min-width: 500px;

      @media (max-width: 550px) {
        min-width: 90%;
      }

      &__actions {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
</style>
