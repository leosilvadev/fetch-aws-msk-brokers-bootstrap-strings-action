const core = require('@actions/core');
const github = require('@actions/github');
const KafkaClient = require("@aws-sdk/client-kafka")

const client = new KafkaClient({ region: "REGION" });
const params = {};

client.listClusters(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else console.log(data);

    core.setOutput('brokers_url_plain', 'fake_brokers_url_plain');
    core.setOutput('brokers_url_ssl', 'fake_brokers_url_ssl')
});