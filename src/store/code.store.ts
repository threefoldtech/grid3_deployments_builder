import { writable } from "svelte/store";
import { v4 } from "uuid";

export class Disk {
  constructor(
    public id: string = v4(),
    public _label: string = "disks",
    public name: string = "mydisk",
    public size: number = 2,
    public description: string = "this is my disk description"
  ) {}
}

export class VM {
  constructor(
    public id: string = v4(),
    public _label: string = "vms",
    public name: string = "vm",
    public flist: string = "https://hub.grid.tf/tf-official-apps/base:latest.flist",
    public cpu: number = 1,
    public memory: number = 1024,
    public entrypoint: string = "/sbin/zinit init",
    public mounts: Mount[] = [new Mount(), new Mount()],
    public env_vars: Env[] = [new Env()]
  ) {}
}

export class Mount {
  constructor(
    public id: string = v4(),
    public _label: string = "mounts",
    public disk_name: string = "mydisk1",
    public mount_point: string = "/opt"
  ) {}
}

export class Env {
  constructor(
    public id: string = v4(),
    public _label: string = "env_vars",
    public key: string = "SSH_KEY",
    public value: string = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDTwULSsUubOq3VPWL6cdrDvexDmjfznGydFPyaNcn7gAL9lRxwFbCDPMj7MbhNSpxxHV2+/iJPQOTVJu4oc1N7bPP3gBCnF51rPrhTpGCt5pBbTzeyNweanhedkKDsCO2mIEh/92Od5Hg512dX4j7Zw6ipRWYSaepapfyoRnNSriW/s3DH/uewezVtL5EuypMdfNngV/u2KZYWoeiwhrY/yEUykQVUwDysW/xUJNP5o+KSTAvNSJatr3FbuCFuCjBSvageOLHePTeUwu6qjqe+Xs4piF1ByO/6cOJ8bt5Vcx0bAtI8/MPApplUU/JWevsPNApvnA/ntffI+u8DCwgP"
  ) {}
}

export class Resource {
  constructor(
    public node: number = 2,
    public disks: Disk[] = [],
    public vms: VM[] = []
  ) {}
}

function createCodeStore() {
  const { subscribe, update } = writable(new Resource());

  return {
    subscribe,
  };
}

export default createCodeStore();
