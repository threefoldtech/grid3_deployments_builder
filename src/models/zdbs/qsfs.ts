import { v4 } from "uuid";
import { ResourceInterface } from "..";

export class QsfsZDBs implements ResourceInterface {
  constructor(
    readonly type: string = "qsfsZdbs",
    readonly qsfsZdbsType: string = "",
    public id: string = v4(),
    public name: string = "",
    public count: number = 3,
    public nodeIds: number[] = [],
    public diskSize: number = 10,
    public password: string = "",
    public metadata: string = "",
    public description: string = "",
    public isDeployed: boolean = false
  ) {}
}
