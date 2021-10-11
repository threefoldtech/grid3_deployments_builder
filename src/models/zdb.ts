import { v4 } from "uuid";

export class ZDB {
  constructor(
    public id = v4(),
    public name = "zdb1",
    public mode = "seq",
    public size = 10,
    public diskType = "hdd",
    public description = "zdb1 description",
    public namespace = "zdbnamespace1",
    public password = "zdbpasswd1",
  ) {}
}
