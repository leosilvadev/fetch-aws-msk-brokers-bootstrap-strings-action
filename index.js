const core = require('@actions/core');
const github = require('@actions/github');
const {
    KafkaClient,
    ListClustersCommand,
    GetBootstrapBrokersCommand
} = require("@aws-sdk/client-kafka")

const region = core.getInput('region');
const clusterArn = core.getInput('cluster-arn');

console.log(`Fetchings cluster info for region ${region}`);

const client = new KafkaClient({ region: region });

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
    core.setOutput('zookeeper_string', result.zookeeperConnectString);
    core.setOutput('zookeeper_tls_string', result.zookeeperConnectStringTls);
    core.setOutput('brokers_string', result.BootstrapBrokerString);
    core.setOutput('brokers_sasl_iam_string', result.BootstrapBrokerStringSaslIam);
    core.setOutput('brokers_sasl_scram_string', result.BootstrapBrokerStringSaslScram);
    core.setOutput('brokers_sasl_tls_string', result.BootstrapBrokerStringTls);
}).catch(error => {
    core.setFailed(error);
});