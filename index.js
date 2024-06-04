const core = require('@actions/core');
const {
  KafkaClient,
  ListClustersCommand,
  GetBootstrapBrokersCommand
} = require("@aws-sdk/client-kafka")

const ESCAPE_RESULT = core.getInput('escape-result') || false;
const REGION = core.getInput('region');

console.log(`Fetchings cluster info for region ${REGION}`);

const handleStringResult = value => {
  if (value && ESCAPE_RESULT) {
    return value.replace(/,/g, '\\,');
  }

  return value;
};

async function run() {
  try {
    const client = new KafkaClient({ region: REGION });
    
    const data = await client.send(new ListClustersCommand({}));
    console.log(`Found ${data.ClusterInfoList.length} clusters, getting brokers string from the first one`);
    const firstCluster = data.ClusterInfoList[0];
    const cluster = {
      clusterArn: firstCluster.ClusterArn,
      zookeeperConnectString: firstCluster.ZookeeperConnectString,
      zookeeperConnectStringTls: firstCluster.ZookeeperConnectStringTls
    };
    
    const result = await client.send(
      new GetBootstrapBrokersCommand({ 'ClusterArn': cluster.clusterArn })
    );
    
    console.log(`Found given brokers string: ${JSON.stringify(result)}`);
    core.setOutput('zookeeper_string', handleStringResult(cluster.zookeeperConnectString));
    core.setOutput('zookeeper_tls_string', handleStringResult(cluster.zookeeperConnectStringTls));
    core.setOutput('brokers_string', handleStringResult(result.BootstrapBrokerString));
    core.setOutput('brokers_sasl_iam_string', handleStringResult(result.BootstrapBrokerStringSaslIam));
    core.setOutput('brokers_sasl_scram_string', handleStringResult(result.BootstrapBrokerStringSaslScram));
    core.setOutput('brokers_sasl_tls_string', handleStringResult(result.BootstrapBrokerStringTls));
  } catch (error) {
    core.setFailed(error);
  }
}

(async() => {
  await run();
})();
