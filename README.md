You need to install `MetaMask` mobile wallet, to be able to connect to `Berachain Testnet` and sing the transactions. On the first run of the script, QR-code will be generated, you need to scan it with MetaMask.

- To find the open trade just run `npm run find`
- To close trade just run `npm run close`

If your trade has different `pairIndex` and/or `index` (trade index), then edit the script and update the values of the `getStorageOpenTrade` and `closeTrade` function calls
Pair indexes can be found at https://docs.berps.berachain.com/intro/deployed-contracts
