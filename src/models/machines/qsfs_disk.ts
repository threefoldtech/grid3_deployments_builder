import { v4 } from "uuid";

export class QsfsDisk {
  constructor(
    public id = v4(),
    public name: string = "",
    public qsfsZdbsName: string = "",
    public prefix: string = "",
    public encryption_key: string = "",
    public cache: number,
    public minimalShards: number,
    public expectedShards: number,
    public mountpoint: string = "",
    public isDeployed: boolean = false
  ) {}
}
