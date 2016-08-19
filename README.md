# Maze Solver

Solution for Weekly Programming Challenge #3 by Jamis Buck.

[https://medium.com/@jamis/weekly-programming-challenge-3-932b16ddd957](https://medium.com/@jamis/weekly-programming-challenge-3-932b16ddd957)

This solution written in Javascript for Node 4.x and implements a breadth-first algortihm.

# Usage

In your terminal:
```bash
node solve.js any_maze_file.txt
```

Outputs: Cardinal points followed by how many steps required to solve the maze
```bash
east
south
west
west
north
5 steps
```


# Visual representation

In your terminal:
```bash
node solve.js mazes/maze-normal/maze-normal-005.txt --visual
```
Outputs: A visual representasion

![alt tag](https://github.com/flixo/mazesolver/blob/master/docs/visual.png?raw=true)




# Visual representation with playback
In your terminal:
```bash
node solve.js mazes/maze-normal/maze-normal-005.txt --playback
```
Outputs:

![alt tag](https://github.com/flixo/mazesolver/blob/master/docs/playback.gif?raw=true)