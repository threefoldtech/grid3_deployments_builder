export class Network {
  constructor(
    public grid = "grid_network",
    public type = "net1",
    public name = "network12346",
    public node: number[] = [2, 4],
    public ipRange = "10.1.0.0/16",
    public description = "newer network"
  ) {}
}
