import { v4 } from "uuid";

export class Mount {
  constructor(
    public id: string = v4(),
    public disk_name: string = "mydisk1",
    public mount_point: string = "/opt"
  ) {}
}
