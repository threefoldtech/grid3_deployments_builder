import { v4 } from "uuid";
import type { Mount } from "./mount";
import type { Env } from "./env";
import type { Disk } from "./disk";

export class VM {
  constructor(
    public id: string = v4(),
    public name: string = "vm",
    public flist: string = "https://hub.grid.tf/tf-official-apps/base:latest.flist",
    public cpu: number = 1,
    public memory: number = 1024,
    public entrypoint: string = "/sbin/zinit init",
    public mounts: Mount[] = [],
    public env_vars: Env[] = [],
    public disks: Disk[] = [],
    public publicIp: boolean = false
  ) {}
}
