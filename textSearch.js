function textSearchSetup(){
    $("#search").keypress(function(event) {
        if( event.which == 13 ) {
            searchHelper()
       }
    })

    $("#searchSubmit").click(function() {
        searchHelper();
    })	
}

function searchHelper() {
	var searchQuery = $("#search").val().toLowerCase();
	$("#search").val("");
    
    var searchResults =[];
	for(jokeId in data) {
		if(data[jokeId]["text"].toLowerCase().match(searchQuery)) {
			jokeObj = data[jokeId]
            var jokeTextCopy = jokeObj["text"].substring(0);
            jokeTextCopy = jokeTextCopy.replace(searchQuery, "<b>" + searchQuery + "</b>");

            var newJokeObject = jokeObj;
            newJokeObject["text"] = jokeTextCopy;
            
            searchResults.push(newJokeObject);
		}
	}
    
	populateSearchResults(searchResults);
}

function populateSearchResults(searchResults) {
	$("#numResults").text("    (# Results: "+searchResults.length+")");
	$("#searchResults").html("");
	searchResultDiv = $("#searchResults").append($("<div class=''>"));
	for(var i = 0; i < searchResults.length; i++) {
        jokeObj = searchResults[i]    
		div = displayJoke(jokeObj)
		$("#searchResults").append(div);
	}
}

function displayJoke(jokeObj){
    jokeText = jokeObj["text"]
    jokeAuthor = jokeObj["author"]
    jokeId = jokeObj["id"]
    
    div = $("<div class='jokeForDisplay' id= 'joke"+jokeId+"'>")
    div.append(jokeText + "<br>" + jokeAuthor)
    wrap = function(d, jokeId){
        d.click(function(){
            selectJoke(this, jokeId)
        })
    }
    wrap(div, jokeId)
    
    return div
}

function selectJoke(t, jokeId){
    //remove all highlighting
    $(".jokeForDisplay").each(function(index){
        $(this).removeClass("highlighted")
    })
    //highlight this joke
    $(t).addClass("highlighted")
    
    showGiantTextBox(jokeId)
}