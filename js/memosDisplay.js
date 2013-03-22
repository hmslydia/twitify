memos = {
    "1": {
        "jokeId": 1,
        "currentMemoCounter": 3,
        "memos": {
            "0" : {
                "memoId": "0",
                "text" : "asdf",
                "time": "1:30pm",
                "author": "hmslydia"
            },
            "1" : {
                "memoId": "1",
                "text" : "jkl;",
                "time": "1:31pm",
                "author": "hmslydia"
            },
            "2" : {
                "memoId": "2",
                "text" : "qwerty",
                "time": "1:32pm",
                "author": "hmslydia"
            }            
        }
    }
}

function showMemosForJoke(jokeId){
    memosForJoke = getMemosForJoke(jokeId)
    arrayOfMemosToDisplaySORTED = getSortedArrayOfMemos(memosForJoke)    
    displayExistingMemos(arrayOfMemosToDisplaySORTED)
    addMemoUI()
}

function getMemosForJoke(jokeId){
    return memos[jokeId]["memos"]
}

function getSortedArrayOfMemos(memosForJoke){
    arrayOfMemosToDisplay = []
    for (memoId in memosForJoke){
        memoObj = memosForJoke[memoId]
        memoDiv = displayMemo(memoObj)        
        arrayOfMemosToDisplay.push({"id": memoId*1, "memoDiv": memoDiv})
    }        
    return arrayOfMemosToDisplay.sort(function(a,b){return a["id"]-b["id"] })
}

function displayExistingMemos(arrayOfMemosToDisplaySORTED){
    $("#memosList").html("")
    for(var i = 0; i< arrayOfMemosToDisplaySORTED.length; i++){
        memoDiv = arrayOfMemosToDisplaySORTED[i]["memoDiv"]
        console.log(memoDiv)
        $("#memosList").append($(memoDiv))
    }
}

function displayMemo(memoObj){
    memoText = memoObj["text"]
    memoTime = memoObj["time"]
    memoAuthor = memoObj["author"]
    
    div = $("<div class='memoForDisplay'>")
    div.append(memoText + "<br>" + memoAuthor)
    /*
    wrap = function(d, jokeId){
        d.click(function(){
            selectedJokeId = jokeId
            selectJoke(this, jokeId)
            
        })
    }
    wrap(div, jokeId)
    */
    
    return div
}

function addMemoUI(){
    memoText = $("<textarea id ='saveMemo'>")
    $("#memosList").append(memoText)
    
    addMemoButton = $("<input type='button' value='add memo'>")
    addMemoButton.click(function(){
        saveMemo()
    })
    $("#memosList").append(addMemoButton)
}

function saveMemo(){
    memoText = $("#saveMemo").val()
    //jokeId
    //author
    
}


function saveMemoCallback(){
    showMemosForJoke(jokeId)
}