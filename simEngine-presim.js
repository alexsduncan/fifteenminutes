function SimEvent(buttonTypes,textFunc,showUpIfFunc,simVarsEffectsFunc) {
    this.buttonTypes = buttonTypes; 
    this.textFunc = textFunc;
    this.showUpIfFunc = showUpIfFunc;
    this.simVarsEffectsFunc = simVarsEffectsFunc;
}

var simValues = {};

function getSimValue(valueName) {
  if(simValues[valueName] === undefined) {
    return 0;
  } else {
    return simValues[valueName];
  }
}

function DecisionEffect(value,delta) {
  this.value = value;
  this.delta = delta;
  this.doEffect = function () {
    if(simValues[this.value] === undefined) {
      simValues[this.value] = 0;
    }
    simValues[this.value] += this.delta;
    console.log("Updating " + this.value + " to " + simValues[this.value] + " change of " +
                this.delta);
  }
}

function DecisionButton(label,effectsArray,showUpIfFunc) {
  this.label = label;
  this.effectsArray = effectsArray;
  this.showUpIfFunc = showUpIfFunc;
}

function SetToValue(prop, num)
{
	this.prop = prop;
	this.num = num;
	this.doEffect = function () {
    if(simValues[this.prop] === undefined) {
      simValues[this.prop] = 0;
    }
    simValues[this.prop] = this.num;
    console.log("Updating " + this.prop + " to " + simValues[this.prop]);
  }
}

function alwaysFunc() {return true};

function doNothingFunc() { console.log("simVarsEffectsFunc: no effect"); };

var SimTextSet = [];

var timeStep = 0;

var timeWeHaveLeft = 0;
var countdownID = -1;
var timeoutID = -1;
var displayDebug = 0;

function timeLimitForThisQuestion(sec, decisionEffects) {
  timeWeHaveLeft = sec;
  timeoutID = window.setTimeout( advanceSim, sec*1000, decisionEffects );
  console.log("Starting timer... ("+timeWeHaveLeft+" sec)");
}

function updateDebugOutput() {
  // that will work if we're in a hurry, kind of crude though
  // console.log( simValues );
  // document.getElementById("debugState").innerHTML = JSON.stringify(simValues, null, 2);

  if(displayDebug != 0)
  {
	  document.getElementById("debugState").innerHTML = "<hr/>";
	  for(var property in simValues) {
		if (property == "shows" || property == "equip" || property == "weeks" || property == "albums" || property == "money" || property == "energy" || property == "songs" || property == "contract" || property == "independent" || property == "stoneHenge" || property == "team")
		{
		}
		else
		{
			document.getElementById("debugState").innerHTML +=
				property + ": "+simValues[property]+"<br/>";
		}
	  }
  }
}

function drawBar(forValName,maxValue,scaleFactor) {
  var actualVal = getSimValue(forValName);
  var stringToReturn = "";
  if (forValName == "fame")
  {
 	  for(var i=0;i<actualVal*scaleFactor;i++) {
		stringToReturn += "<img src=\"goldStar.png\">"; // "<img src=\"redSq.png\">"
	  }
	  for(;i<maxValue*scaleFactor;i++) {
		stringToReturn += "<img src=\"whiteStar.png\">"; // "<img src=\"blueSq.png\">"
	  }
  }
  else if(forValName == "shows")
  {
 	  for(var i=0;i<actualVal*scaleFactor;i++) {
		stringToReturn += "<img src=\"guitar.png\">"; // "<img src=\"redSq.png\">"
	  }
	  for(;i<maxValue*scaleFactor;i++) {
		stringToReturn += ""; // "<img src=\"blueSq.png\">"
	  }
  }
  else
  {
	  for(var i=0;i<actualVal*scaleFactor;i++) {
		stringToReturn += "<img src=\"greenSq.png\">"; // "<img src=\"redSq.png\">"
	  }
	  for(;i<maxValue*scaleFactor;i++) {
		stringToReturn += "<img src=\"graySq.png\">"; // "<img src=\"blueSq.png\">"
	  }
  }
  return stringToReturn;
}

function limitVar(varName,min,max) {
  if(getSimValue(varName)<min) {
    simValues[varName] = min;
  } else if(getSimValue(varName)>max) {
    simValues[varName] = max;
  }
}

function options()
{
	return "OPTIONS:<br/>Play show (+$250, -1 energy)<br/>Record 2 songs (-$500, -1 energy)<br/>Sleep (+1 energy)<br/>Play BIG gig (+$750, -2 energy) *requires at least 6 shows played*<br/><br><img src=\"mainpic.jpg\" height=\"400\" width=\"400\"><br/>";
}