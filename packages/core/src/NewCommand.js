const createIncrementCommand = (counter) => {
  const previousCount = counter.count

  return {
    execute() {
      counter.count += 1
    },
    undo() {
      counter.count = previousCount
    }
  }
}

const createDecrementCommand = (counter) => {
  const previousCount = counter.count

  return {
    execute() {
      counter.count -= 1
    },
    undo() {
      counter.count = previousCount
    }
  }
}

const INCREMENT = 'INCREMENT'
const DECREMENT = 'DECREMENT'

const commands = {
  [INCREMENT]: createIncrementCommand,
  [DECREMENT]: createDecrementCommand
}

export class CommandManager {
  constructor(target) {
    this.target = target
    this.history = [null]
    this.position = 0
  }

  doCommand(commandType) {
    if (position < history.length - 1) {
      history = history.slice(0, position + 1)
    }

    if (commands[commandType]) {
      const concreteCommand = commands[commandType](target)
      history.push(concreteCommand)
      position += 1

      concreteCommand.execute()
    }
  }

  undo() {
    if (position > 0) {
      history[position].undo()
      position -= 1
    }
  }

  redo() {
    if (position < history.length - 1) {
      position += 1
      history[position].execute()
    }
  }
}
