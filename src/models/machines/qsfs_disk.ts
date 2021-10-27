import { v4 } from "uuid";

export class QsfsDisk {
  constructor(
    public name: string = "",
    public qsfs_zdbs_name: string = "",
    public prefix: string = "",
    public encryption_key: string = "",
    public mountpoint: string = "",
    public isDeployed: boolean = false
  ) {}
}
