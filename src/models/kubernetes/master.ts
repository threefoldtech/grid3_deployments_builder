import { v4 } from "uuid";
import { QsfsDisk } from "..";

export class Master {
  constructor(
    public id = v4(),
    public diskSize: number = 23,
    public node: number = 2,
    public name = "",
    public cpu: number = 2,
    public publicIp: boolean = true,
    public memory: number = 2048,
    public rootFsSize: number = 1,
    public qsfsDisks: QsfsDisk[] = [],
    public planetary: boolean = false,
    public isDeployed: boolean = false
  ) {}
}
