const core = require('@actions/core');
const github = require('@actions/github');
const {
    KafkaClient,
    ListClustersCommand,
    GetBootstrapBrokersCommand
} = require("@aws-sdk/client-kafka")

const escapeResult = core.getInput('escape-result') ||  false;
const region = core.getInput('region');
const clusterArn = core.getInput('cluster-arn');

console.log(`Fetchings cluster info for region ${region}`);

const client = new KafkaClient({ region: region });

const handleStringResult = value => {
    if (value && escapeResult) {
        return value.replace(/,/g, '\\,');
    }

    return value;
};

client.send(new ListClustersCommand({})).then(data => {
    console.log(`Found ${data.ClusterInfoList.length} clusters, getting brokers string from the first one`);
    const firstCluster = data.ClusterInfoList[0];
    return {
        clusterArn: firstCluster.ClusterArn,
        zookeeperConnectString: firstCluster.zookeeperConnectString,
        zookeeperConnectStringTls: firstCluster.zookeeperConnectStringTls
    };

}).then(cluster => {
    const { clusterArn } = cluster;
    return client.send(
        new GetBootstrapBrokersCommand({ 'ClusterArn': clusterArn })
    ).then(result => Object.assign({}, result, cluster));

}).then(result => {
    console.log(`Found given brokers string: ${JSON.stringify(result)}`);
    core.setOutput('zookeeper_string', handleStringResult(result.zookeeperConnectString));
    core.setOutput('zookeeper_tls_string', handleStringResult(result.zookeeperConnectStringTls));
    core.setOutput('brokers_string', handleStringResult(result.BootstrapBrokerString));
    core.setOutput('brokers_sasl_iam_string', handleStringResult(result.BootstrapBrokerStringSaslIam));
    core.setOutput('brokers_sasl_scram_string', handleStringResult(result.BootstrapBrokerStringSaslScram));
    core.setOutput('brokers_sasl_tls_string', handleStringResult(result.BootstrapBrokerStringTls));
}).catch(error => {
    core.setFailed(error);
});