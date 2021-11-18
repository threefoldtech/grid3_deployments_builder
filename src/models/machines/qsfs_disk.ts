import { v4 } from "uuid";

export class QsfsDisk {
  constructor(
    public id = v4(),
    public name: string = "",
    public qsfsZdbsName: string = "",
    public prefix: string = "",
    public encryptionKey: string = "",
    public cache: number = 1,
    public minimalShards: number = 1,
    public expectedShards: number = 2,
    public mountpoint: string = "",
    public isDeployed: boolean = false
  ) {}
}
