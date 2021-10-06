import { v4 } from "uuid";

export class ZDB {
  constructor(
    public id = v4(),
    public name = "zdb1",
    public size = 10,
    public description = "zdb1 description",
    public password = "zdbpasswd1",
    public mode = "user"
  ) {}
}
