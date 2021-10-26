import { v4 } from "uuid";

export class ZDB {
  constructor(
    public id = v4(),
    public name: string = "zdb1",
    public node: number = 2,
    public mode: string = "seq",
    public size: number = 10,
    public password: string = "zdbpasswd1",
    public publicIp: boolean = false,
    public isDeployed: boolean = false
  ) {}
}
