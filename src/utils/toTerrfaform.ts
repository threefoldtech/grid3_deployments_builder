import type { Resource, Disk, VM, Mount, Env } from "../store/code.store";

export default function toTerraform(value: Resource) {
  if (!value) return;

  return `resource "${value.title}" "${value.name}" {
    node = ${value.node}
    ${exportDisks(value.disks)}
    ${exportVms(value.vms)}
}
      `;
}

function exportDisks(disks: Disk[]) {
  return disks.reduce((res, disk) => {
    res += `
    disks {
        name = "${disk.name}"
        size = ${disk.size}
        description = "${disk.description}"
    }
      `;

    return res;
  }, "");
}

function exportVms(vms: VM[]) {
  return vms.reduce((res, vm) => {
    res += `
    vms {
        name = "${vm.name}"
        flist = "${vm.flist}"
        cpu = ${vm.cpu}
        memory = ${vm.memory}
        entrypoint = "${vm.entrypoint}"
        ${exportMounts(vm.mounts)}
        ${exportEnvs(vm.env_vars)}
    }    
        `;

    return res;
  }, "");
}

function exportMounts(mounts: Mount[]) {
  return mounts.reduce((res, mount) => {
    res += `
    mounts {
        disk_name = "${mount.disk_name}"
        mount_point = "${mount.mount_point}"
    }
      `;

    return res;
  }, "");
}

function exportEnvs(envs: Env[]) {
  return envs.reduce((res, env) => {
    res += `
      env_vars {
          key = "${env.key}"
          value = "${env.value}"
      }
        `;

    return res;
  }, "");
}
