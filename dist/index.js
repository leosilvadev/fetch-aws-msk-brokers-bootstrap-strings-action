/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 105:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 82:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 565:
/***/ ((module) => {

module.exports = eval("require")("@aws-sdk/client-kafka");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(105);
const github = __nccwpck_require__(82);
const {
    KafkaClient,
    ListClustersCommand,
    GetBootstrapBrokersCommand
} = __nccwpck_require__(565)

const region = core.getInput('region');
const clusterArn = core.getInput('cluster-arn');

console.log(`Fetchings cluster info for region ${region}`);

const client = new KafkaClient({ region: region });

client.send(new ListClustersCommand({})).then(data => {
    console.log(`Found ${data.ClusterInfoList.length} clusters, getting brokers string from the first one`);
    return data.ClusterInfoList[0].ClusterArn;
}).then(clusterArn => {
    return client.send(new GetBootstrapBrokersCommand({ 'ClusterArn': clusterArn }));
}).then(result => {
    console.log(`Found given brokers string: JSON.stringify(result)`);
    core.setOutput('brokers_string', result.BootstrapBrokerString);
    core.setOutput('brokers_sasl_iam_string', result.BootstrapBrokerStringSaslIam);
    core.setOutput('brokers_sasl_scram_string', result.BootstrapBrokerStringSaslScram);
    core.setOutput('brokers_sasl_tls_string', result.BootstrapBrokerStringTls);
}).catch(error => {
    core.setFailed(error);
});

})();

module.exports = __webpack_exports__;
/******/ })()
;