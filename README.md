#Running the Program
Install the latest version of node.
Run `node main.js`
Optionally include a path for a different input file `node main.js pathToFile`

##Assumptions
Input must be structured such that each instruction is on a new line.
Only 4 types of input are accepted and are case sensitive.
1. 'cityX - cityY'
2. 'cities from cityX in n jumps'
3. 'can I teleport from cityX to cityY'
4. 'loop possible from cityX'

### Project Summary
You have discovered the secrets of teleportation and have several teleportation routes up and
running. Each route
allows instantaneous travel from one city to another. All routes are two way: if you can teleport from
city A
to city B, you can also teleport from city B to city A. You want to create a system to make it easier for
you to
answer specific questions about your network. You should assume anyone using your network
wants to travel only by teleportation.
Questions you must be able to answer:
1. What cities can I reach from city X with a maximum of N jumps?
2. Can someone get from city X to city Y?
3. Starting in city X, is it possible to travel in a loop (leave the city on one route and return on
another, without traveling along the same route twice)?