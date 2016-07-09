// Place third party dependencies in the lib folder
//
// Configure loading modules from the lib directory,
// except 'app' ones, 
requirejs.config({
    "baseUrl": "js",
    shim : {
        "bootstrap" : { "deps" :['jquery'] }
    },
    paths: {
        "jquery" : "//code.jquery.com/jquery-2.1.1.min",
        "bootstrap" :  "//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min"  ,
        "aws" :  "//sdk.amazonaws.com/js/aws-sdk-2.2.15.min"  ,
		"wordcloud" :  "lib/wordcloud2" ,
		"combinatorics" :  "lib/combinatorics",
        "countdown" :  "lib/jquery.countdown.min"  ,
        "timersjs" :  "lib/timers"  

    }
});

// Load the main app module to start the app
requirejs(["app/main"]);

