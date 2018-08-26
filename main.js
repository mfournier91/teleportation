(function main(inputFilePath = './input.txt') { //Set default input path if no command line arg
  var fs = require('fs');
  var graphEdgeList = []
  var graphAdjacency = {}
  var questions = []
  var answers = []

  fs.readFile(inputFilePath, 'utf8', function(err, data) {
    let input = data.split('\n')
    input.forEach(processInput) //Process the input into a graph and related questions
    questions.forEach(processQuestion) // Process each question
    answers.forEach(printAnswer) // Output the answers
  });


  function processInput(input) { // Check input format and either add to graph or add to questions
    if (input.split(' - ').length === 2){ // Input format is 'City - City'
      let pair = input.split(' - ')
      graphEdgeList.push(pair) // Add pair to edge list
      addToGraphAdjacency(pair, graphAdjacency)
    }
    else if (input.startsWith('cities')){ // Input format is 'cities from City in n jumps'
      //console.log('cities')
      questions.push({
        type: 'cities from',
        from: input.split('cities from ')[1].split(' in ')[0],
        jumps: parseInt(input.split('cities from ')[1].split(' in ')[1].split(' jumps')[0])
      })
    }
    else if (input.startsWith('can')){ // Input format is 'can I teleport from City to City'
      //console.log('can')
      questions.push({
        type: 'can I teleport',
        from: input.split('can I teleport from ')[1].split(' to ')[0],
        to: input.split('can I teleport from ')[1].split(' to ')[1]
      })
    }
    else if (input.startsWith('loop')) { // Input format is 'loop possible from City'
      //console.log('loop')
      questions.push({
        type: 'loop',
        from: input.split('loop possible from ')[1]
      })
    }
    else {
      console.error('ERROR input not accepted: ' + input);
    }
  }

  function addToGraphAdjacency(pair, graphAdjacency){
    graphAdjacency[pair[0]] === undefined ? graphAdjacency[pair[0]] = [] : null // Add pair to adjacency object
    graphAdjacency[pair[0]].push(pair[1])
    graphAdjacency[pair[1]] === undefined ? graphAdjacency[pair[1]] = [] : null // Add inverse of pair to adjacency object
    graphAdjacency[pair[1]].push(pair[0])
  }

  function processQuestion(question) { // Check question type and call appropriate function
    switch (question.type){
      case 'cities from':
        answers.push({question: question, answer: answerCitiesFrom(question)})
        break;
      case 'can I teleport':
        answers.push({question: question, answer: answerCanTeleport(question, graphAdjacency)})
        break;
      case 'loop':
          answers.push({question: question, answer: answerLoop(question)})
        break;
      default:
        null;
    }
  }
  
  function addNewCitiesToCityList(startCity, cityList, i, graphAdjacency) {
    if (i === 0) {
      
      cityList.push(graphAdjacency[startCity])
    }
    else {
      let newCities = []
      cityList[i-1].forEach((city) => newCities = newCities.concat(graphAdjacency[city]).concat(city))
      newCities = newCities.filter((city) => city !== startCity).filter((value, index, self) => self.indexOf(value) === index)
      cityList.push(newCities)
    }
  }

  function answerCitiesFrom(question) {
    let cities = []
    for (let i = 0; i < question.jumps; i++) {
      addNewCitiesToCityList(question.from, cities, i, graphAdjacency)
    }
    return cities[cities.length - 1].join(', ');
  }

  function answerCanTeleport(question, graphAdjacency) {
    let cities = []
    let retVal = 'no'
    let i = 0;
    while (true) { // loop until yes or no determined
      if (cities.length > 0 && cities[cities.length - 1].includes(question.to)) { // If the latest list of cities includes the target city, return yes
        retVal = 'yes'
        break
      }
      addNewCitiesToCityList(question.from, cities, i, graphAdjacency)
      
      if (cities.length > 1 && cities[cities.length - 1].length === cities[cities.length - 2].length){ // If in the last two loops, no new cities exist, return no 
        break;
      }
      i++;
    }
    return retVal
  }
  
  function answerLoop(question) {    
    // For Each Edge that contains question.from
    let retVal = 'no'
    graphEdgeList.filter((edge) => edge.includes(question.from)).forEach((edge) => {
      //create a copy graph that does not contain that edge
      //create copy graph as edgelist
      if (retVal !== 'yes'){
      let filteredEdges = graphEdgeList.filter((filterEdge) => filterEdge !== edge)
      //create adjacency from edgelist
      let filteredAdjacency = {}
      filteredEdges.forEach((pair) => addToGraphAdjacency(pair, filteredAdjacency))
      
      //call answerCanTeleport({from: someNodeNextToInitialNodeWhereTheEdgeWasOmitted, to: question.from}, filteredAdjacency)
      let adjacentCity = edge.filter((city) => city !== question.from)[0]
      !filteredAdjacency[adjacentCity] ? filteredAdjacency[adjacentCity] = [] : null
      if (answerCanTeleport({from: adjacentCity, to: question.from}, filteredAdjacency) === 'yes') {
        retVal = 'yes'
      }
    }
    })
    return retVal
  }
  
  function printAnswer(answer) {
    let {question} = answer
    switch (question.type){
      case 'cities from':
        console.log(`cities from ${question.from} in ${question.jumps} jumps: ${answer.answer}`)
        break;
      case 'can I teleport':
        console.log(`can I teleport from ${question.from} to ${question.to}: ${answer.answer}`)
        break;
      case 'loop':
        console.log(`loop possible from ${question.from}: ${answer.answer}`)
        break;
      default:
        null;
    }
  }

})(process.argv[2]) //Optionally pass in command line argument for input file
