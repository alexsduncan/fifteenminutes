function initSimVars() {
  simValues['money'] = 1500;
  simValues['shows'] = 0;
  simValues['songs'] = 0;
  simValues['energy'] = 5;
  simValues['weeks'] = 0;
  simValues['equip'] = 0;
  simValues['albums'] = 0;
  simValues['fame'] = 0;
  simValues['contract'] = 0;
  simValues['independent'] = 0;
  simValues['stoneHenge'] = 0;
  simValues['team'] = 0;
  console.log( "variables initialized" );
}

function boundSimVars() {
  limitVar("energy",0,10);
  limitVar("money",0,1000000);
  limitVar("fame", 0, 50);
}

var SimTextSet_BeginningSeries = [];
var SimTextSet_MiddlePossibilities_A = [];
var SimTextSet_MiddlePossibilities_B = [];
var SimTextSet_MiddlePossibilities_C = [];
var SimTextSet_MiddlePossibilities_D = [];
var SimTextSet_MiddlePossibilities_E = [];
var SimTextSet_MiddlePossibilities_F = [];
var SimTextSet_MiddlePossibilities_Sick = [];
var SimTextSet_MiddlePossibilities_Album = [];
var SimTextSet_MiddlePossibilities_Tour = [];
var SimTextSet_EndingSeriesA = [];
var SimTextSet_EndingSeriesB = [];
var SimTextSet_EndingSeries_Stone = [];
var SimTextSet_EndingSeries_Team = [];

function simSpecificOutput() {
  var returnText = "";
  if(simValues['albums'] < 1)
	returnText += "<br>Week: " + simValues['weeks'] + " / 32<br><br>";
  returnText += "<br>Money: $" + simValues['money'] + "<br><br>";
  returnText += "Energy " + drawBar("energy",10,1) + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
  returnText += "Fame " + drawBar("fame", 50, .2) + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
  if(simValues['albums'] < 1)
  {
	returnText += "Album Progress " + drawBar("songs", 12, 1) + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
	returnText += "Shows: " + drawBar("shows", 20, 1) + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
	returnText += "Studio Equipment: " + simValues['equip'];
  }
  return returnText;
}

SimTextSet_BeginningSeries[SimTextSet_BeginningSeries.length] = new SimEvent(
          [new DecisionButton("Got it!",[],alwaysFunc)],
          function () { return "<br/><br/>You're a musician! You've got 8 months (32 weeks) to record an album of 12 songs!<br/>"; },
          alwaysFunc,
          doNothingFunc
          );

SimTextSet_BeginningSeries[SimTextSet_BeginningSeries.length] = new SimEvent(
          [new DecisionButton("I'm ready to rock!",[],alwaysFunc)],
          function () { return "Here's $1,500 to get you started. You can record 2 songs at a time for $500. Play shows to make money and become famous (so that people will buy your album and come to your shows when you start touring), but remember that recording songs and playing shows takes energy - you'll need to sleep at some point!<br/>"; },
          alwaysFunc,
          doNothingFunc
          );

function nextMiddleSeries() {
  var newFame = (simValues['contract'] * 5) + (simValues['independent'] * 2) + (simValues['shows'] / 2);
  simValues['fame'] = Math.floor(newFame);
  
  if(getSimValue('energy') < 3){
	return SimTextSet_MiddlePossibilities_Sick;
  }
  else if(getSimValue('energy') >= 3)
  {
	if(getSimValue('contract') > 0 || getSimValue('independent') > 0)
	{
		return SimTextSet_MiddlePossibilities_Tour;
	}
	else if(getSimValue('songs') > 11)
	{
		return SimTextSet_MiddlePossibilities_Album;
	}
	else if(getSimValue('money') > 2500)
	{
		if(getSimValue('shows') > 5)
		{
			if(getSimValue('equip') > 0)
				return SimTextSet_MiddlePossibilities_A;
			else
				return SimTextSet_MiddlePossibilities_B;
		}
		else
		{
			if(getSimValue('equip') > 0)
				return SimTextSet_MiddlePossibilities_C;
			else
				return SimTextSet_MiddlePossibilities_D;
		}
	}
	else
	{
		if(getSimValue('shows') > 5)
		{
			return SimTextSet_MiddlePossibilities_A;
		}
		else
		{
			return SimTextSet_MiddlePossibilities_C;
		}
	}
  }
}

function endSeriesIfConditionsMet() {
  if(getSimValue('weeks') >= 32){
	return SimTextSet_EndingSeriesB;
  }
  else if(getSimValue('stoneHenge') > 0)
  {
	return SimTextSet_EndingSeries_Stone;
  }
  else if(getSimValue('team') > 0)
  {
	return SimTextSet_EndingSeries_Team;
  }
  return null;
}

/*---------------------------------------------------INITIAL MIDDLE SCENARIOS---------------------------------------------------*/

SimTextSet_MiddlePossibilities_Sick[SimTextSet_MiddlePossibilities_Sick.length] = new SimEvent(
          [new DecisionButton("Sleep",[new DecisionEffect("energy", 1),
                                      new DecisionEffect("weeks", 1)],alwaysFunc)],
          function () { return "Your energy is too low. You'll need to sleep to replenish it.<br/>"; },
          alwaysFunc,
          doNothingFunc
          );

SimTextSet_MiddlePossibilities_A[SimTextSet_MiddlePossibilities_A.length] = new SimEvent(
          [new DecisionButton("Play gig",[new DecisionEffect("money",250),
                                      new DecisionEffect("shows",1),
                                      new DecisionEffect("energy", -1),
									  new DecisionEffect("weeks", 1)],alwaysFunc),
            new DecisionButton("Record 2 songs",[new DecisionEffect("money",-500),
                                      new DecisionEffect("songs", 2),
                                      new DecisionEffect("energy", -1),
									  new DecisionEffect("weeks", 1)],function(){return (getSimValue('money') > 499)}),
            new DecisionButton("Sleep",[new DecisionEffect("energy", 1),
                                      new DecisionEffect("weeks", 1)],alwaysFunc),
            new DecisionButton("Record 1 song",[new DecisionEffect("money",-125),
                                      new DecisionEffect("songs", 1),
                                      new DecisionEffect("energy", -1),
									  new DecisionEffect("weeks", 1)],function(){return (getSimValue('equip') > 0 && getSimValue('money') > 124)}),
            new DecisionButton("Play BIG gig",[new DecisionEffect("money",750),
                                      new DecisionEffect("shows",1),
                                      new DecisionEffect("energy", -2),
									  new DecisionEffect("weeks", 1)],alwaysFunc)],
          options,
          alwaysFunc,
          doNothingFunc
          );

SimTextSet_MiddlePossibilities_B[SimTextSet_MiddlePossibilities_B.length] = new SimEvent(
          [new DecisionButton("Play gig",[new DecisionEffect("money",250),
                                      new DecisionEffect("shows",1),
                                      new DecisionEffect("energy", -1),
									  new DecisionEffect("weeks", 1)],alwaysFunc),
            new DecisionButton("Record 2 songs",[new DecisionEffect("money",-500),
                                      new DecisionEffect("songs", 2),
                                      new DecisionEffect("energy", -1),
									  new DecisionEffect("weeks", 1)],function(){return (getSimValue('money') > 499)}),
            new DecisionButton("Sleep",[new DecisionEffect("energy", 1),
                                      new DecisionEffect("weeks", 1)],alwaysFunc),
            new DecisionButton("Play BIG gig",[new DecisionEffect("money",750),
                                      new DecisionEffect("shows",1),
                                      new DecisionEffect("energy", -2),
									  new DecisionEffect("weeks", 1)],alwaysFunc),
            new DecisionButton("Purchase studio equipment",[new DecisionEffect("money",-1000),
									  new DecisionEffect("equip", 1)],function(){return (getSimValue('equip') < 1 && getSimValue('money') > 999)})],
          options,
          alwaysFunc,
          doNothingFunc
          );

SimTextSet_MiddlePossibilities_C[SimTextSet_MiddlePossibilities_C.length] = new SimEvent(
          [new DecisionButton("Play gig",[new DecisionEffect("money",250),
                                      new DecisionEffect("shows",1),
                                      new DecisionEffect("energy", -1),
									  new DecisionEffect("weeks", 1)],alwaysFunc),
            new DecisionButton("Record 2 songs",[new DecisionEffect("money",-500),
                                      new DecisionEffect("songs", 2),
                                      new DecisionEffect("energy", -1),
									  new DecisionEffect("weeks", 1)],function(){return (getSimValue('money') > 499)}),
            new DecisionButton("Sleep",[new DecisionEffect("energy", 1),
                                      new DecisionEffect("weeks", 1)],alwaysFunc),
            new DecisionButton("Record 1 song",[new DecisionEffect("money",-125),
                                      new DecisionEffect("songs", 1),
                                      new DecisionEffect("energy", -1),
									  new DecisionEffect("weeks", 1)],function(){return (getSimValue('equip') > 0 && getSimValue('money') > 124)})],
          options,
          alwaysFunc,
          doNothingFunc
          );
      
SimTextSet_MiddlePossibilities_D[SimTextSet_MiddlePossibilities_D.length] = new SimEvent(
          [new DecisionButton("Play gig",[new DecisionEffect("money",250),
                                      new DecisionEffect("shows",1),
                                      new DecisionEffect("energy", -1),
									  new DecisionEffect("weeks", 1)],alwaysFunc),
            new DecisionButton("Record 2 songs",[new DecisionEffect("money",-500),
                                      new DecisionEffect("songs", 2),
                                      new DecisionEffect("energy", -1),
									  new DecisionEffect("weeks", 1)],function(){return (getSimValue('money') > 499)}),
            new DecisionButton("Sleep",[new DecisionEffect("energy", 1),
                                      new DecisionEffect("weeks", 1)],alwaysFunc),
            new DecisionButton("Purchase studio equipment",[new DecisionEffect("money",-1000),
									  new DecisionEffect("equip", 1)],function(){return (getSimValue('equip') < 1 && getSimValue('money') > 999)})],
          options,
          alwaysFunc,
          doNothingFunc
          );

/*---------------------------------------------------POST-ALBUM SCENARIOS---------------------------------------------------*/

SimTextSet_MiddlePossibilities_Album[SimTextSet_MiddlePossibilities_Album.length] = new SimEvent(
          [new DecisionButton("Continue",[new DecisionEffect("albums",1),
                                      new SetToValue("songs", 0)],alwaysFunc)],
          function () { return "Congratulations, you've recorded enough songs to release an album!<br/>" + "<img src=\"album.jpg\" height=\"400\" width=\"400\"><br/>"; },
          alwaysFunc,
          doNothingFunc
          );

SimTextSet_MiddlePossibilities_Album[SimTextSet_MiddlePossibilities_Album.length] = new SimEvent(
          [new DecisionButton("Release independently",[new DecisionEffect("money",5000),
                                      new DecisionEffect("fame",1),
                                      new DecisionEffect("energy", -2),
									  new DecisionEffect("independent", 1)],alwaysFunc),
            new DecisionButton("Sign to a label",[new DecisionEffect("money",1000),
                                      new DecisionEffect("fame", 5),
                                      new DecisionEffect("energy", -1),
									  new DecisionEffect("contract", 1)],alwaysFunc)],
          function () {return "How would you like to release your album? Releasing it on your own will get you more money, but it'll require more energy. Signing to a label will require less energy, and you'll get more famous, but you won't get as much money.<br/>";},
          alwaysFunc,
          doNothingFunc
          );

/*---------------------------------------------------TOUR SCENARIOS---------------------------------------------------*/
		  
SimTextSet_MiddlePossibilities_Tour[SimTextSet_MiddlePossibilities_Tour.length] = new SimEvent(
          [new DecisionButton("Continue",[],alwaysFunc)],
          function () { return "Time to go on tour!<br/>"; },
          alwaysFunc,
          doNothingFunc
          );
		  
SimTextSet_MiddlePossibilities_Tour[SimTextSet_MiddlePossibilities_Tour.length] = new SimEvent(
          [new DecisionButton("Buy more gear",[new SetToValue("money",50)],alwaysFunc),
            new DecisionButton("Get a day job again*",[],alwaysFunc)],
          function () {return "Oh no, your gear got stolen! What do you want to do?";},
          alwaysFunc,
          doNothingFunc
          );
		  
SimTextSet_MiddlePossibilities_Tour[SimTextSet_MiddlePossibilities_Tour.length] = new SimEvent(
          [new DecisionButton("Buy better gear and a miniature Stone Henge",[new DecisionEffect("fame", 30),
										new DecisionEffect("stoneHenge", 1)],alwaysFunc),
            new DecisionButton("Buy a basketball team",[new DecisionEffect("fame", 30),
										new DecisionEffect("team", 1)],alwaysFunc)],
          function () {return "One of your songs just hit No. 1 on the charts! What do you want to do with your extra cash?";},
          alwaysFunc,
          doNothingFunc
          );

/*---------------------------------------------------ENDING SCENARIOS---------------------------------------------------*/
		  
SimTextSet_EndingSeriesA[SimTextSet_EndingSeriesA.length] = new SimEvent(
          [new DecisionButton("End",[],alwaysFunc)],
          function () { return "Bankrupt!<br/>" + "<img src=\"bankrupt.jpeg\"><br/>"; },
          alwaysFunc,
          doNothingFunc
          );

SimTextSet_EndingSeriesB[SimTextSet_EndingSeriesB.length] = new SimEvent(
          [new DecisionButton("End",[],alwaysFunc)],
          function () { return "Ran out of time!<br/>" + "<img src=\"notime.jpg\"><br/>"; },
          alwaysFunc,
          doNothingFunc
          );

SimTextSet_EndingSeries_Stone[SimTextSet_EndingSeries_Stone.length] = new SimEvent(
          [new DecisionButton("End",[],alwaysFunc)],
          function () { return "Congratulations - you're a superstar, and your stage show is a massive success!"; },
          alwaysFunc,
          doNothingFunc
          );

SimTextSet_EndingSeries_Team[SimTextSet_EndingSeries_Team.length] = new SimEvent(
          [new DecisionButton("End",[],alwaysFunc)],
          function () { return "Congratulations on purchasing the basketball team, the South Georgia Dopplegangers! You're now a music mogul!"; },
          alwaysFunc,
          doNothingFunc
          );