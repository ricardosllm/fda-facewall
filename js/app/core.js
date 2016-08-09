define(["jquery","aws", "app/config", "timersjs"],function($,a,c,ts){

	var imgList = [];
	var timeinterval;
	var timer;
	var timerDashboard;

	if (!String.prototype.format) {
	  String.prototype.format = function() {
	    var args = arguments;
	    return this.replace(/{(\d+)}/g, function(match, number) { 
	      return typeof args[number] != 'undefined'
	        ? args[number]
	        : match
	      ;
	    });
	  };
	}

	function getParameterByName(name) {
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(location.search);
	    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	function timeConverter(UNIX_timestamp){
	  var a = new Date(UNIX_timestamp * 1000);
	  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	  var year = a.getFullYear();
	  var month = months[a.getMonth()];
	  var date = a.getDate();
	  var hour = a.getHours();
	  var min = a.getMinutes();
	  var sec = a.getSeconds();
	  var time = hour + ':' + min + ':' + sec ;
	  return time;
	}

	var getCameraId = function (){
		//console.log(queryStrings);
		//console.log(getParameterByName("cameraId"));
		var cameraId =   getParameterByName("cameraid")!="" ? getParameterByName("cameraid") : c.defaultCameraId;
		return cameraId;

	}

	function initDashboardTimer(){
		var region = c.AWS.region; //'ap-northeast-1'
		var identityPoolId = c.AWS.identityPoolId;
		
		AWS.config.region = region;	
		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		    IdentityPoolId: identityPoolId
		});

		var cameraid = getCameraId();

		timerDashboard = TimersJS.timer(3000, function() {
		   	console.log("initDashboardTimer run");

		    var params = {
          TableName: c.AWS.resourcesCountTable,
		        Key: { 
		            id: {
		            	S: cameraid 
		            }
		        }
		    };

      var dynamodbOptions = {
        region: AWS.config.region
      };
        var dynamodb = new AWS.DynamoDB(dynamodbOptions);
      console.log(dynamodb);
		    dynamodb.getItem(params, function(err, data) {
		        if (err) 
		        {
		            console.log(err);
		        }
		        else
		        { 
		            console.log(data);
                item = data.Item;
              console.log(item);
		            $("#lblraws3counter").html("{0} ".format(item.itemcountraw.N));

		            $("#lblcrops3counter").html("{0} ".format(item.itemcountcrop.N));




		        }
		    });

		   this.restart();
		});
	}

	function initTimer(){
		var region = c.AWS.region; //'ap-northeast-1'
		var identityPoolId = c.AWS.wallIdentityPoolId;
		
		AWS.config.region = region;	
		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		    IdentityPoolId: identityPoolId
		});

		var cameraid = getCameraId();
		
		timer = TimersJS.timer(3000, function() {
    
		    console.log("This is output every 3000ms");
		    var timeStamp;
		    var lastDiv = $("#last-timestamp")
		    //console.log(lastDiv)
		    var lastQry = getParameterByName("last");
		    if (lastDiv.text() == '')
		    {
		    	if(lastQry)
		    		timeStamp = parseInt(lastQry);
				else
				{
					startTime = (new Date("December 2, 2015 00:00:00")).getTime();
					timeStamp = Math.floor(startTime / 1000);    
		        	timeStamp = timeStamp - 10000;   

				}
//1440530800;

		        
		    }   
		    else
		    {
		        timeStamp = lastDiv.text();
		    }    
      console.log(timeStamp);
      var params = {
        TableName:  c.AWS.snapshotTable,
        IndexName: 'cameraid-unixtimestamp-index',
        KeyConditions: {
          cameraid: {
            ComparisonOperator: 'EQ',
            AttributeValueList: [ { S: cameraid }, ]
          },
          unixtimestamp: {
            ComparisonOperator: 'GT',
            AttributeValueList: [ { N: timeStamp.toString() }, ]
          }
        },
        ScanIndexForward: true,
        Limit: 20,
        ConsistentRead: false,
        Select: 'ALL_ATTRIBUTES',
        ReturnConsumedCapacity: 'NONE'
      };
      var dynamodbOptions = {
        region: AWS.config.region
      };
        var dynamodb = new AWS.DynamoDB(dynamodbOptions);
        dynamodb.query(params, function(err, data) {
		        if (err) 
		        {
		            console.log(err);
		        }         
		        else
		        { 
		            console.log(data);            
		            var ul = $(".row");
		                       
		            data = data.Items
		            data.forEach(function(item){
		                //console.log(item)
		                //console.log(item.croppedurl.S)
		                //console.log(item.rawurl)		                



		                ul.prepend(jQuery('<article class="entry box-item imgSnap "><div class="box-wrap"><figure class="entry-thumb zoomable"><a class="fancybox grow" href="' + item.rawurl.S + '"><img class="facethumbnail" src="' + item.croppedurl.S + '" alt=""></a></figure><div   class="entry-meta"><span class="love-no imgmeta">' + 'Camera ' + item.cameraid.S + '</span><span style="padding-left:30px;" class="love-no imgmeta">' + timeConverter(item.unixtimestamp.N) + '</span></div></div></article>'))
		             
		                if (ul.children().length > 160) 
		                {
		                    $(".row article:last-child").remove()
		                    //console.log("Removed")     
		                }
		                var lastDiv = $("#last-timestamp")
		                lastDiv.text(item.unixtimestamp.N)                                
		            })    
		        }
		    });   
		    
		   this.restart();
		});
	}

	var startDashboard = function (){
		if(!timerDashboard)
		{
			initDashboardTimer();
		}
		else
		{
			timerDashboard.restart();
		}
		
	}


	var startDataStream = function (){

		if(!timer)
		{
			initTimer();
		}
		else
		{
			timer.restart();
		}
	}

	var stopDataStream = function (){
		if(timer)
		timer.pause();
	}



	var core = {		
		startDataStream : startDataStream,
		stopDataStream : stopDataStream,
		startDashboard : startDashboard

	};

	return core;	
});
