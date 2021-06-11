const core = require('@actions/core');
const github = require('@actions/github');
const { KafkaClient, ListClusterOperationsCommand } = require("@aws-sdk/client-kafka")

const region = core.getInput('region');
const clusterArn = core.getInput('cluster-arn');

const client = new KafkaClient({ region: region });
const params = { 'ClusterArn': clusterArn };

console.log(`Running command Lister Cluster with params: ${params}`);

const command = new ListClusterOperationsCommand(params);

client.send(command).then(data => {
    console.log('Success!!!!!')
    console.log(data);

    core.setOutput('brokers_url_plain', 'fake_brokers_url_plain_success');
    core.setOutput('brokers_url_ssl', 'fake_brokers_url_ssl_success');
}, error => {
    console.error(error);

    core.setOutput('brokers_url_plain', 'fake_brokers_url_plain_failure');
    core.setOutput('brokers_url_ssl', 'fake_brokers_url_ssl_failure');
});