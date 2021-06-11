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

client.send(new ListClustersCommand({})).then(data => {
    return data.ClusterInfoList[0].ClusterArn;
}).then(clusterArn => {
    return client.send(new GetBootstrapBrokersCommand({ 'ClusterArn': clusterArn }));
}).then(result => {
    core.setOutput('brokers_string', result.BootstrapBrokerString);
    core.setOutput('brokers_sasl_iam_string', result.BootstrapBrokerStringSaslIam);
    core.setOutput('brokers_sasl_scram_string', result.BootstrapBrokerStringSaslScram);
    core.setOutput('brokers_sasl_tls_string', result.BootstrapBrokerStringTls);
}).catch(error => {
    core.setFailed(error);
});