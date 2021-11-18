import { v4 } from "uuid";
import { ResourceInterface } from "..";

import type { ZDB } from "./zdb";

export class ZDBs implements ResourceInterface {
  constructor(
    readonly type: string = "zdbs",
    public id: string = v4(),
    public name: string = "",
    public zdbs: ZDB[] = [],
    public isDeployed: boolean = false,
    public description: string = "",
    public metadata: string = ""
  ) {}
}
