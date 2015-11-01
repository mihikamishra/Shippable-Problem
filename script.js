 issuesList  = { last24:[],last7:[], more7:[] };

function getIssues() {
	$('#submitUrlBtn').hide();	
	
	//Get Url from User
	urlText=$('#repoUrl').val();
	//Check if it is a Valid github repository
	if(urlText=="" || (urlText.toLowerCase().indexOf('github.com')==-1))
	{
	$('#errorMsg').html('Please enter a valid github repository').css('display','block');
	return -1;
	}
	
	//Get Owner and Repository info from Url
	stripHttp=urlText.indexOf('http:\/\/');
	stripHttps=urlText.indexOf('https:\/\/')
	if (stripHttp!=-1){ 
		urlText=urlText.slice(stripHttp+7); 
		}
	else if (stripHttps!=-1) {
		urlText=urlText.slice(stripHttps+8);
		}
	else{ }
	urlText=urlText.split('\/');
	
	if(urlText[0].toLowerCase()=='api.github.com'){
		Owner=urlText[2];
		repos=urlText[3];
		}
	else{
		Owner=urlText[1];
		repos=urlText[2];
		}
	   
	if((typeof repos=== undefined )|| repos == null){ 
		$('#errorMsg').html('Please Enter a valid repository and Try again').css('display','block');
	   return -1; 
	   }

	//Create a request to read the response headers to get
	//the total number of issue pages from the last page http header variable.
	var req = new XMLHttpRequest();
	var url='https://api.github.com/repos/'+Owner+'/'+repos+'/issues';
		req.open('GET', url, false);
		req.send(null);
	var headers = req.getAllResponseHeaders(); 

	
	//Extract the last page number
	var startPos=headers.indexOf("next");
	var endPos=headers.indexOf("last");
	var rawStr=headers.slice(startPos+6,endPos-7);
	var noOfPages=rawStr.split("=");
	var pageCount=parseInt(noOfPages[1].slice(0,-1));  
	
	if(startPos==-1 || endPos==-1) pageCount=1;

	var today = new Date();
		today = today.toISOString();

	//Read and save all issues 
	for(i=1;i<=pageCount;i++){	
		issues=$.getJSON( url+'?page='+i, function( data ) {
			$.each( data, function( key, val ) {
				x=datediff(val.created_at)  //Check and save the issues according to its date
				addIssues(x,val); 
			});
		displayIssues(issuesList.last24.length,issuesList.last7.length,issuesList.more7.length);
		}).error(function() { 
		$('#errorMsg').html("Please Check the repository and try again").css('display','block');
		return -1;
		});
	}
}

function addIssues(x,val){
	if(x==1){ issuesList.last24.push(val); } 				// for issues within last24hrs
	else if(x > 1 && x < 7) { issuesList.last7.push(val);}  // for issues in last 7 days
	else { issuesList.more7.push(val); }	 				//for issues more than 7 days
}

function displayIssues(lastdayLength,last7days,morethan7days){  
	var totalLength=lastdayLength+last7days+morethan7days;
	$('#totalIssues').html(parseInt(totalLength));
	$('#last24Hrs').html(parseInt(lastdayLength));
	$('#last7').html(parseInt(last7days));
	$('#morethan7').html(parseInt(morethan7days));

}

//Calculating the Date Difference
function datediff(datestring){
	var _MS_PER_DAY = 1000 * 60 * 60 * 24;
	//z='2015-09-03T08:29:39Z'; ISO String date format
	var x=new Date(datestring);
	var y= new Date();
	var utc1=Date.UTC(x.getFullYear(), x.getMonth(), x.getDate());
	var utc2 = Date.UTC(y.getFullYear(), y.getMonth(), y.getDate());
	return ( Math.floor((utc2 - utc1) / _MS_PER_DAY));
}  
