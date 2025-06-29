export const DIFFICULTY = {
  EASY: {
    name: "Apprentice",
    range: [1, 20],
    time: 30,
    scoreMultiplier: 1,
    operations: ['+', '-']
  },
  MEDIUM: {
    name: "Scholar", 
    range: [10, 50],
    time: 25,
    scoreMultiplier: 2,
    operations: ['+', '-', '*']
  },
  HARD: {
    name: "Master",
    range: [20, 100],
    time: 20,
    scoreMultiplier: 3,
    operations: ['+', '-', '*', '/']
  }
};

export const OPERATIONS = {
  '+': 'Addition',
  '-': 'Subtraction', 
  '*': 'Multiplication',
  '/': 'Division'
};

export const PUZZLE_TYPES = {
  CALCULATION: 'calculation',
  MISSING_OPERATION: 'missing_operation'
};
