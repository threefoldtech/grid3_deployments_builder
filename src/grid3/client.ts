import { HTTPMessageBusClient } from "ts-rmb-http-client";
import { GridClient } from "grid3_client";

export async function getClient(mnemStore, projectName): Promise<GridClient> {
  const { explorerUrl, mnemonics, proxyUrl } = mnemStore;
  const rmb = new HTTPMessageBusClient(0, proxyUrl);
  const grid = new GridClient(explorerUrl, mnemonics, rmb, projectName);
  await grid.connect();
  return grid;
}
