"use strict"
const fs = require('fs')

class Maze {
  constructor(buffer, visual, playback) {
    this.exit
    this.start
    this.width
    this.height
    
    this.visual = visual
    this.playback = playback
    
    this.maze = this.parseMaze(buffer)
    this.iterations = 0
    
    this.solve()
  }
  
  parseMaze (buffer) {
    let start, maze = []
    buffer.toString('utf8').split(/\n|\r\n/).forEach((r, y) => {
      if (r.length === 0) return
      let row = []
      for(let x = 0; x < r.length; x++) {
        row.push({
          wall: (r[x] === '#') ? true : false,
          x: x,
          y: y
        })
        
        if (r[x] === 'X') this.exit = {x: x, y:y} //Set exit
        if (r[x] === 'O') this.start = {x: x, y:y} //Set position
      }
      maze.push(row)
    })
    
    this.height = maze.length
    this.width  = maze[0].length
    
    return maze
  }
  
  solve () {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.maze[y][x].distance = Infinity
        this.maze[y][x].parent   = null
      }
    }
    
    var start = this.maze[this.start.y][this.start.x]
        start.distance = 0
        
    var queue = []
    
    queue.push(start)
    
    while (queue.length > 0) {
      let tile = queue.shift()
      
      if (this.exit.x === tile.x && this.exit.y === tile.y) {
        var solution = []
        var x = function (tile) {
          if (!tile) return
          solution.push(tile)
          x(tile.parent)
        }
        x(tile)
        
        solution.reverse()
        solution.shift()
        
        if (this.playback) {
          this.playbackSolution(solution)
        } else if (this.visual) {
          solution.pop()
          this.drawSolution(solution)
        } else {
          this.printSolution(solution)
        }
      }
      
      let directions = [
        [tile.x + -1, tile.y +  0],
        [tile.x +  0, tile.y + -1],
        [tile.x +  1, tile.y +  0],
        [tile.x +  0, tile.y +  1],
      ]
      
      directions.forEach((v) => {
        try {
          let child = this.maze[v[1]][v[0]]
          if (child.distance == Infinity && !child.wall) {
            child.distance = tile.distance + 1
            child.parent = tile
            queue.push(child)
          }
        } catch (e) {
          //Who cares?
        }
      })
    }
  }
  
  playbackSolution (steps) {
    let i = 0
    let timer = setInterval(() => {
      this.drawMaze(steps[i].x, steps[i].y, null, i + 1)
      i++
      if (i === steps.length) clearInterval(timer)
    }, 50)
  }
  
  drawSolution (steps) {
    this.drawMaze(null, null, steps, steps.length + 1)
  }
  
  printSolution (steps) {
    process.stdout.write('\u001B[2J\u001B[0;0f')
    let last = this.start
    steps.forEach((step) => {
      let x = step.x - last.x
      let y = step.y - last.y
      last = step
      if (y === -1) {
        console.log('north')
      } else if (y === 1) {
        console.log('south')
      } else if (x === 1) {
        console.log('east')
      } else if (x === -1) {
        console.log('west')
      }
    })
    console.log(steps.length + ' steps')
  }
  
  drawMaze (posX, posY, solution, steps) {
    process.stdout.write('\u001B[2J\u001B[0;0f')
    console.log('\n')
    for (let y = 0; y < this.width; y++) {
      let row = '  '
      for (let x = 0; x < this.width; x++) {
        let drawn = false
        
        if (solution) {
          solution.forEach((step, i) => {
            if (step.x === x && step.y === y) {
              row += ('\x1b[47m' + '  ' + '\x1b[0m')
              drawn = true
            }
          })
        }
        
        if (!drawn) {
          if (x === posX && y === posY) {
            row += ('\x1b[47m' + '  ' + '\x1b[0m')
          } else if (x === this.start.x && y === this.start.y) {
            row += ('\x1b[43m' + '  ' + '\x1b[0m')
          } else if (x === this.exit.x && y === this.exit.y) {
            row += ('\x1b[41m' + '  ' + '\x1b[0m')
          } else if (this.maze[y][x].wall) {
            row += ('\x1b[44m' + '  ' + '\x1b[0m')
          } else {
            row += ('  ')
          }
        }
      }
      
      var extra = ''
      
      switch (y) {
        case 0: {
          extra += '  ' + '\x1b[43m' + '  ' + '\x1b[0m' + ' START'
          break;
        }
        case 2: {
          extra += '  ' + '\x1b[41m' + '  ' + '\x1b[0m' + ' EXIT'
          break;
        }
        case 4: {
          extra += '  ' + '\x1b[47m' + '  ' + '\x1b[0m' + ' PATH'
          break;
        }
        case 6: {
          extra += '  ' + '  ' + ' STEPS: ' + steps
          break;
        }
      }
      
      console.log(row + extra)
    }
    console.log('\n')
  }
}

let path = process.argv[2]
let visual = false
let playback = false

process.argv.forEach((arg) => {
  if (arg === '--visual') visual = true
  if (arg === '--playback') playback = true
})

fs.readFile(path, (err, buffer) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.log(`Error: Maze file ${err.path} not found.`)
    } else {
      throw err
    }
  } else {
    new Maze(buffer, visual, playback)
  }
})