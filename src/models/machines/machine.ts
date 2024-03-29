import { v4 } from "uuid";

import type { Env } from "./env";
import type { Disk } from "./disk";
import type { QsfsDisk } from "./qsfs_disk";

export class Machine {
  constructor(
    public id: string = v4(),
    public name: string = "",
    public node: number = 0,
    public flist: string = "https://hub.grid.tf/tf-official-apps/base:latest.flist",
    public cpu: number = 1,
    public memory: number = 1024,
    public rootFsSize: number = 1,
    public entrypoint: string = "/sbin/zinit init",
    public env_vars: Env[] = [],
    public disks: Disk[] = [],
    public qsfsDisks: QsfsDisk[] = [],
    public publicIp: boolean = false,
    public planetary: boolean = false,
    public isDeployed: boolean = false
  ) {}
}
