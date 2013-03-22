function twitterFeedSetup(){
	ajax("getTwitterFeed", {}, function(returnData) {
		displayFeed(JSON.parse(returnData)["nextJokes"]);
		
		//select the first item
		firstJokeId = twitterFeed[0]["id"]
		firstJokeObj = $("#joke"+firstJokeId)
		selectJoke(firstJokeObj, firstJokeId)
	});
	
}

function displayFeed(nextJokes){
	$("#twitterFeed").empty()
	twitterFeed = nextJokes
	
	console.log("displayFeed")
	twitterFeedIds = map(twitterFeed, function (x) {return x["id"]})
	console.log(twitterFeedIds)
	
	twitterFeedDiv = $("#twitterFeed").append($("<div class=''>"));
	
	
	//display all the jokes
	for(var i = 0; i < twitterFeed.length; i++) {
        jokeObj = twitterFeed[i]    
		div = displayJoke(jokeObj)
		$("#twitterFeed").append(div);
	}


}

function fetchNewJokeForFeed(){
	twitterFeedIds = map(twitterFeed, function (x) {return x["id"]})	
	//get index of selected joke in feed
	
	indexOfSelectedJoke = twitterFeedIds.indexOf(selectedJokeId)	
	
	ajax("getTwitterFeedUpdate", {"twitterFeedIds":twitterFeedIds, "selectedJokeId":selectedJokeId}, function(returnData) {
		//update the twitterfeed
		//1. removed the selected Joke from the TwitterFeed
		twitterFeed = filterArray(twitterFeed, function(x){	return x["id"] != selectedJokeId })
		
		//2. add this new joke
		
		newJokeObj = JSON.parse(returnData)["nextJoke"]
		twitterFeed.push(newJokeObj[0])
		
		//3. re-display the twitterFeed
		displayFeed(twitterFeed)
		
		//4. select the index of the selected joke
		newSelectedJokeId = twitterFeed[indexOfSelectedJoke]["id"]
		displayedJokeObj = $("#joke"+newSelectedJokeId)
		
		console.log("newSelectedJokeId "+newSelectedJokeId)
		
		selectJoke(displayedJokeObj, newSelectedJokeId)
	});
}

