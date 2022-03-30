# Fetch AWS MSK Brokers Bootstrap strings action

This action fetches the Brokers and Zookeeper Boostrap string from your AWS MSK Cluster.
**Currently the action fetchs the strings for the first MSK Cluster found, if you want to fetch from all or use some filter to match the right one, this is not yet supported.**

## Inputs

### `region`

**Required** The name of the region your cluster is configured.

## Outputs

### `brokers_string`

Brokers URL for no SSL access (if enabled, or else empty)

### `brokers_sasl_iam_string`

Brokers URL for SSL access and IAM Authentication (if enabled, or else empty)

### `brokers_sasl_scram_string`

Brokers URL for SSL access and SCRAM Authentication (if enabled, or else empty)

### `brokers_sasl_tls_string`

Brokers URL for SSL access and TLS Authentication (if enabled, or else empty)

### `zookeeper_string`

Zookeeper URL for no SSL access (if enabled, or else empty)

### `zookeeper_tls_string`

Zookeeper URL for SSL access (if enabled, or else empty)

## Example usage

``` yaml
uses: mobimeo/fetch-aws-msk-brokers-bootstrap-strings-action@v1.2
with:
  region: "eu-central-1"
```
