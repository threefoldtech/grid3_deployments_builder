import { v4 } from "uuid";

export class QsfsDisk {
  constructor(
    public name: string = "qsfs_disk_name",
    public qsfs_zdbs_name: string = "qsfs_zdbs_name",
    public prefix: string = "",
    public encryption_key: string = "",
    public mountpoint: string = "/opt",
    public isDeployed: boolean = false
  ) {}
}
