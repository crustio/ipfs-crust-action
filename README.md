# Crust IPFS pin action

Decentralized pin your site to Crust IPFS Network from Github Action

## Inputs

### `cid`

> Currently, we only support CIDv0 format.

**Required** The cid value from IPFS.

### `seeds`

> Seeds is the private key of Crust Maxwell Account, you can:
> 1. Apply yourself by refering this [doc](https://wiki.crust.network/docs/en/crustAccount)
> 2. Join Crust [Discord Channel](https://discord.gg/D97GGQndmx)

**Required**, Crust secret seeds, consist of 12 words. And you need to make sure you have CRUs in your account to send the transaction.

### `size`

*Optional*, The cumulative size value from IPFS. Default `209715200 (200MB)`.

### `crust-endpoint`

*Optional*, Crust websocket endpoint. Default `'wss://rpc.crust.network'`.

### `ipfs-gateway`

*Optional*, IPFS public gateway which opens `/api` function. Default `'https://ipfs.io'`.

## Outputs

### `res`

**boolean**, Pin successfully or failed.

## Example usage

```yaml
uses: crustio/ipfs-crust-action@v2.0.4
with:
  cid: QmevJf2rdNibZCGrgeyVJEM82y5DsXgMDHXM6zBtQ6G4Vj
  size: 10034432
  seeds: ${{ secrets.CRUST_SEEDS }}
```

## Contribution

Feel free to dive in! [Open an issue](https://github.com/crustio/ipfs-crust-action/issues/new) or send a PR.

To contribute to Crust in general, see the [Contribution Guide](https://github.com/crustio/crust/blob/master/docs/CONTRIBUTION.md)

## License

[MIT](https://github.com/crustio/ipfs-crust-action/blob/main/LICENSE) @Crust Network
