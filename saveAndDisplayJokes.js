function displayJoke(jokeObj){
    jokeText = jokeObj["text"]
    jokeAuthor = jokeObj["author"]
    jokeId = jokeObj["id"]
    
    div = $("<div class='jokeForDisplay' id= 'joke"+jokeId+"'>")
    div.append(jokeText + "<br>" + jokeAuthor)
    wrap = function(d, jokeId){
        d.click(function(){
			storeOldData()
            selectJoke(this, jokeId)
        })
    }
    wrap(div, jokeId)
    
    return div
}


function selectJoke(t, jokeId){
	highlightJoke(jokeId)
	getDiscussionFromJokeId(jokeId);
    selectedJokeId = jokeId;
	console.log("new SelectedJoke: "+jokeId)
}

function highlightJoke(jokeId){
    //remove all highlighting
    $(".jokeForDisplay").each(function(index){
        $(this).removeClass("highlighted")
    })
    //highlight this joke
    $("#joke"+jokeId).addClass("highlighted")
}

function getDiscussionFromJokeId(jokeId) {
	ajax("getDiscussion", {"jokeId" : jokeId}, function(returnData) {
		displayDiscussion(JSON.parse(returnData));
	});
}

function displayDiscussion(discussObj) {
	//show it on the page.
	discussionObject = discussObj["discussionObject"]
	discussionText = discussionObject["text"]
	$("#giantTextBox").val(discussionText);
}

function storeOldData() {
	if(selectedJokeId != -1) {
		oldJokeId = selectedJokeId
		oldDiscussion = $("#giantTextBox").val();
		ajax("saveDiscussion", {"jokeDiscussion" : oldDiscussion, "jokeId" : oldJokeId}, function() {});
	}	
}