import { v4 } from "uuid";
import { QsfsDisk } from "..";

export class Worker {
  constructor(
    public id = v4(),
    public diskSize: number = 15,
    public node: number = 2,
    public name = "",
    public cpu: number = 2,
    public memory: number = 2048,
    public publicIp: boolean = false,
    public rootFsSize: number = 1,
    public qsfsDisks: QsfsDisk[] = [],
    public planetary: boolean = false,
    public isDeployed: boolean = false
  ) {}
}
