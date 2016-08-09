define([], function(){

	var c = {
		AWS : {
      identityPoolId: 'us-east-1:525ab484-810d-4571-91d3-d33291abde2c',
      region: 'us-east-1',
      s3RawBucket : 'face-detection-app-ricardosllm',
      resourcesCountTable : "resources-counter",
      snapshotTable : "snapshot"
    },
    defaultCameraId : "face-detection-app-ricardosllm",
		durationBtwSnap : 5400
	};
	return c;
});
