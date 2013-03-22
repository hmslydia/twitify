import sys, json, re, pprint, itertools
from cgi import escape
pp = pprint.PrettyPrinter(indent=4)

def loadText(filename):
    arr = []
    with open(filename) as file:
        for line in file:
			line = line.decode("string_escape")
			arr.append(line)
	return arr

def transformJokeData(data):
    newArr = {}
    for index, joke in enumerate(data):
        newArr[index] = {"text":joke, "author":"Dave Barry", "id":index+""}
    return newArr
    
def printJson(filenameNoExtension, data):
    f = open(filenameNoExtension+".js","w")
    jsonData = json.dumps(data, indent=4, separators=(',', ': '))
    f.write("data = "+jsonData)
    f.close()		

data = loadText("jokes.txt")
data = transformJokeData(data)

printJson("jokes", data)

