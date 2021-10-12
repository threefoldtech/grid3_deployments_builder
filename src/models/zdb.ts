import { v4 } from "uuid";

export class ZDB {
  constructor(
    public id = v4(),
    public name = "zdb1",
    public node: number = 2,
    public mode = "seq",
    public size = 10,
    public diskType = "hdd",
    public namespace = "zdbnamespace1",
    public password = "zdbpasswd1",
    public publicIp = false
  ) {}
}
