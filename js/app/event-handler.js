define(["jquery","aws", "app/config","app/core"],function($,a,c,core){
	console.log("event-handler");

  var timeinterval;

	var btnStream_Click = function(){

		$( "#btnStream" ).toggleClass( "active" );
    $( "#btnStream" ).toggleClass("btn-success");
    $( "#btnStream" ).toggleClass("btn-danger");  
		$( "#btnStream" ).text( $( "#btnStream" ).hasClass("active")? $( "#btnStream" ).attr("label-active"):$( "#btnStream" ).attr("label-inactive") );
		
    var isActive = !$( "#btnStream" ).hasClass("active");
    if(!isActive)
    {
      core.startDataStream();
      core.startDashboard();
    }else
    {
      core.stopDataStream();
    }
	}	

  var documentReady = function(){
    btnStream_Click();


  }  

    $("#btnStream").bind("click",btnStream_Click); 

    $(document).ready(documentReady);

 
    
});