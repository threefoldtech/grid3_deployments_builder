import { v4 } from "uuid";
import { ResourceInterface } from "..";

export class QsfsZDBs implements ResourceInterface {
  constructor(
    readonly type: string = "qsfsZdbs",
    public id: string = v4(),
    public name: string = "",
    public count: number = 3,
    public node_ids: number = 2,
    public disk_size: number = 10,
    public password: string = "",
    public metadata: string = "",
    public description: string = "",
    public isDeployed: boolean = false
  ) {}
}
