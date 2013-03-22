//start server
var express = require('express');
var fs = require('fs');
var app = express();

app.use(express.cookieParser()); 
app.use(express.session({ secret: "keyboard cat" }))
app.use(express.bodyParser());

var allData = {}
/*
allData["discussions"] = 
	{"0": {
		"jokeId":0,
		"text":"#tone: stupidity\n#observation\n#lens: dogs as human\n",
		"updates":["222","232323"]},
	"1": {
		"jokeId":1,
		"text":"#typeMismatch: man didn't have to watch\n",
		"updates":["123","456"]},
	"2":{
		"jokeId":2,
		"text":"#typeMismatch\n#tone: informational -> not informational\n",	
		"updates":[]}}
		
allData["users"] = []	
*/

//////////////////////////////////////////
//// instantiate jokes
//////////////////////////////////////////

require('./jokes');
app.get('/jokes.js', function(request, response){
    response.sendfile('jokes.js')
});

var utils = require('./node-utils');

app.get('/utils.js', function(request, response){
    response.sendfile('utils.js')
});

require('./saveAndDisplayJokes');
app.get("/saveAndDisplayJokes.js", function(require, response) {
    response.sendfile("saveAndDisplayJokes.js")
})

require('./textSearch');
app.get("/textSearch.js", function(require, response) {
    response.sendfile("textSearch.js")
})

require('./twitterFeed');
app.get("/twitterFeed.js", function(require, response) {
    response.sendfile("twitterFeed.js")
})

initializeAllData();

function initializeAllData(){
    instatiateMemos()
}

function instatiateMemos(){

    allData.discussions = {}
    for(var i = 0; i < data.length; i++){
        jokeId = data[i]["id"]+""
        allData.discussions[jokeId] = {
            "jokeId": jokeId,
            "text": "",
            "updates": []
        }
    }    
    
    allData.discussions["0"] = {
        "jokeId": 0,
        "text": "omg jk lol",
        "updates": []
    }

    allData.discussions["1"] = {
        "jokeId": 1,
        "text" : "Cats and dogs",
        "updates": []
    }
}

//////////////////////////////////////////
//// homepage 
//////////////////////////////////////////
app.get('/home.html', function(request, response){



	/*
	neesdLogin = "yes"
	if (request.session.logged){
		console.log('Welcome back: '+request.session.id)
		neesdLogin = "no"
		//set a session variable to keep track of the user's taskHistory
		
    }else {
        //Find out who they are:
        request.session.logged = true;
        console.log('new session: '+request.session.id);
		
		//set the taskHistory to {}
		//request.session.taskHistory = [] //["generate", "categorize"]
    }
	*/
    response.sendfile('home.html')
});

app.post('/home.html', function(request, response){
    var dataset = "ideas"
    command = request.body["command"]
	args = JSON.parse(request.body["args"])
	
    //we get worker info from session as soon as the page loads, to see if we already have their name/email stored
	if(command == "getDiscussion"){  
        var jokeId = args["jokeId"]
        if(allData.discussions[jokeId] == undefined) {
            instantiateNewDiscussion(jokeId);
        }
        var discussionObject = allData.discussions[jokeId];
        response.send(JSON.stringify({"discussionObject" : discussionObject}))
        
    }else if (command == "saveDiscussion"){
        var jokeDiscussion = args["jokeDiscussion"]
        var jokeId = args["jokeId"]
		var username = args["username"]
		
		oldJokeDiscussion = allData.discussions[jokeId]["text"]
		
		if ( oldJokeDiscussion != jokeDiscussion ){
			allData.discussions[jokeId]["text"] = jokeDiscussion;
			allData.discussions[jokeId]["updates"].push({"time": getTime() , "username": username});
		}
        response.send("");       
    }else if (command == "getTwitterFeed"){
		var username = args["username"]
		
		//get id's of most recent tweets.
		nextJokes = getNextJokes(username, 5, [])
		response.send(JSON.stringify({"nextJokes" : nextJokes}))
	}else if (command == "getTwitterFeedUpdate"){
		var username = args["username"]
		var twitterFeedIds = args["twitterFeedIds"]
		var selectedJokeId = args["selectedJokeId"]
		console.log(selectedJokeId)
		console.log(twitterFeedIds)
		
		nextJoke = getNextJokes(username, 1, twitterFeedIds)
		response.send(JSON.stringify({"nextJoke" : nextJoke}))
	}
    
})

function instantiateNewDiscussion(jokeId)  {
    allData.discussions[jokeId] = {"jokeId": jokeId,
        "text" : "",
        "updates": []};
}

function getTime(){
	var d = new Date();
	return d.getTime()
}

function getNextJokes(username, number, blockedListIds){	
	jokesArray = utils.dictToArray(data)
	jokesWithNoDiscussion = utils.filterArray(jokesArray, function(jokeObj){ return !jokeHasDiscussion(jokeObj) })
	//remove jokeswith id in blockedList
	availableJokes = utils.filterArray(jokesWithNoDiscussion, function(jokeObj){return blockedListIds.indexOf(jokeObj["id"]) == -1 })
	return availableJokes.slice(0,number)
}

function jokeHasDiscussion(jokeObj){
	jokeId = jokeObj.id+""
	if(jokeId in allData.discussions){
		if (allData.discussions[jokeId]["text"] == ""){
			return false
		}else{
			return true
		}
	}else{
		return false
	}
}

//////////////////////////////////////////
//// visualize data
//////////////////////////////////////////
app.get('/visualize.html', function(request, response){
    response.send(allData)
    writeToFile(allData)
});

function writeToFile(json){
    var ret = "data = "+JSON.stringify(json)
    var d = new Date();
    var t = d.getTime()
    fs.writeFile("./saved/data"+t+".js", ret, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    }); 
}



//////////////////////////////////////////
//// checkpoint and restore
//////////////////////////////////////////

// handle uncaught exceptions to keep Node from crashing
process.on('uncaughtException', function(err) {
  console.log(err);
  console.log(err.stack);
  // TODO: send email about the exception
});

function checkpoint() {
    writeToFile(results);
}

// force a checkpoint
app.get('/checkpoint', function(request, response){
    checkpoint();
    response.send("checkpointed");
});

// restore takes the timestamp that should be restored (from the
// filename saved/dataTIMESTAMP.js)
app.get(/^\/restore\/(\d+)$/, function(request, response) {
    var timestamp = request.params[0]
    console.log("timestamp = " + timestamp);
    // restore the timestamp
    fs.readFile("./saved/data"+timestamp+".js", function(err, restoredData) {
        if(err) {
            console.log(err);
            response.send("can't restore");
        } else {
            // restoredData may begin with "variable = ", so strip that
            restoredData = restoredData.toString().replace(/^\w+\s*=\s*/, "");
            var newResults = JSON.parse(restoredData);

            // see whether this actually changed anything
            var currentResultsJSON = JSON.stringify(results);
            var newResultsJSON = JSON.stringify(newResults);
            var message = "restored " + timestamp +
                " which " +
                (currentResultsJSON != newResultsJSON ? "changed" : "didn't change") +
                " the results state";
            console.log(message)

            // make sure the current state is checkpointed, so we don't
            // lose anything by restoring
            checkpoint();
            
            // now replace the results variable
            results = newResults;
            
            response.send(message)
        }
    });
});

function restoreData(timestamp){
	fs.readFile("./saved/data"+timestamp+".js", function(err, restoredData) {
			if(err) {
				console.log(err);
				response.send("can't restore");
			} else {
				// restoredData may begin with "variable = ", so strip that
				restoredData = restoredData.toString().replace(/^\w+\s*=\s*/, "");
				var newResults = JSON.parse(restoredData);

				// see whether this actually changed anything
				var currentResultsJSON = JSON.stringify(results);
				var newResultsJSON = JSON.stringify(newResults);
				var message = "restored " + timestamp +
					" which " +
					(currentResultsJSON != newResultsJSON ? "changed" : "didn't change") +
					" the results state";
				console.log(message)

				// make sure the current state is checkpointed, so we don't
				// lose anything by restoring
				//checkpoint();
				
				// now replace the results variable
				results = newResults;
				
				//response.send(message)
			}
		});
}

//////////////////////////////////////////
//// start serving
//////////////////////////////////////////

app.listen(3000);
console.log('Listening on port 3000');
//restoreData(1)
