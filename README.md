# Crust IPFS pin action

Decentralized pin your site to Crust IPFS Network from Github Action

## Inputs

### `cid`

> Currently, we only support CIDv0 format.

**Required** The cid value from IPFS.

### `seeds`

> Seeds is the private key of Crust Maxwell Account, you can:
> 1. Apply yourself by refering this [doc](https://wiki.crust.network/docs/en/crustAccount)
> 2. Connect Crust Team to get free seeds by emailing [hi@crust.network](hi@crust.network)
> 3. Join Crust [Discord Channel](https://discord.gg/D97GGQndmx)

**Required**, Crust secret seeds, consist of 12 words.

### `crust-endpoint`

*Optional*, Crust websockt endpoint. Default `'wss://api.crust.network'`.

### `ipfs-gateway`

*Optional*, IPFS public gateway which opens `/api` function. Default `'https://ipfs.io'`.

## Outputs

### `res`

**boolean**, Pin successfully or failed.

## Example usage

```yaml
uses: crustio/ipfs-crust-action@1.0.7
with:
  cid: QmevJf2rdNibZCGrgeyVJEM82y5DsXgMDHXM6zBtQ6G4Vj
  seeds: ${{ secrets.CRUST_SEEDS }}
```

## Contribution

Feel free to dive in! [Open an issue](https://github.com/crustio/ipfs-crust-action/issues/new) or send a PR.

To contribute to Crust in general, see the [Contribution Guide](https://github.com/crustio/crust/blob/master/docs/CONTRIBUTION.md)

## License

[MIT](https://github.com/crustio/ipfs-crust-action/blob/main/LICENSE) @Crust Network
