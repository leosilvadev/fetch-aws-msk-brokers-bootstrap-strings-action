const core = require('@actions/core');
const github = require('@actions/github');
const {
    KafkaClient,
    ListClustersCommand,
    GetBootstrapBrokersCommand
} = require("@aws-sdk/client-kafka")

const region = core.getInput('region');
const clusterArn = core.getInput('cluster-arn');

const client = new KafkaClient({ region: region });
const params = {};

console.log(`Running command Lister Cluster with params: ${JSON.stringify(params)}`);

client.send(new ListClustersCommand(params)).then(data => {
    console.log('Success!!!!!')
    console.log(data);

    return data.ClusterInfoList.ClusterArn;
}).then(clusterArn => {
    return client.send(new GetBootstrapBrokersCommand({ 'ClusterArn': clusterArn }));
}).then(result => {
    console.log(result)
    console.log(JSON.stringify(result))
    core.setOutput('brokers_string', 'fake_brokers_url_plain_success');
    core.setOutput('brokers_sasl_iam_string', 'fake_brokers_url_ssl_success');
    core.setOutput('brokers_sasl_scram_string', 'fake_brokers_url_ssl_success');
    core.setOutput('brokers_sasl_tls_string', 'fake_brokers_url_ssl_success');
}).catch(error => {
    console.error(error);

    core.setOutput('brokers_url_plain', 'fake_brokers_url_plain_failure');
    core.setOutput('brokers_url_ssl', 'fake_brokers_url_ssl_failure');
});