/ Generate puzzles where users find the operation between 4 numbers
const generatePuzzle = (difficulty) => {
  const difficulties = {
    easy: { 
      range: [1, 20], 
      operations: ['+', '-'],
      targetRange: [10, 50]
    },
    medium: { 
      range: [10, 50], 
      operations: ['+', '-', '*'],
      targetRange: [50, 200]
    },
    hard: { 
      range: [20, 100], 
      operations: ['+', '-', '*', '/'],
      targetRange: [100, 500]
    }
  };

  const config = difficulties[difficulty];
  
  // Generate 4 numbers
  const numbers = [];
  for (let i = 0; i < 4; i++) {
    numbers.push(Math.floor(Math.random() * (config.range[1] - config.range[0])) + config.range[0]);
  }
  
  // Choose operations between the numbers
  const operations = [];
  for (let i = 0; i < 3; i++) {
    operations.push(config.operations[Math.floor(Math.random() * config.operations.length)]);
  }
  
  // Calculate the correct answer
  let answer = numbers[0];
  for (let i = 0; i < 3; i++) {
    switch(operations[i]) {
      case '+':
        answer += numbers[i + 1];
        break;
      case '-':
        answer -= numbers[i + 1];
        break;
      case '*':
        answer *= numbers[i + 1];
        break;
      case '/':
        // Ensure integer division by adjusting the number
        if (numbers[i + 1] !== 0) {
          answer = Math.floor(answer / numbers[i + 1]);
        }
        break;
    }
  }
  
  // Create the question string
  const question = `${numbers[0]} ${operations[0]} ${numbers[1]} ${operations[1]} ${numbers[2]} ${operations[2]} ${numbers[3]} = ?`;
  
  // Generate 4 multiple choice options
  const options = [answer];
  while(options.length < 4) {
    const offset = Math.floor(Math.random() * 20) + 1;
    const variant = answer + (Math.random() > 0.5 ? offset : -offset);
    if(!options.includes(variant) && variant > 0) {
      options.push(variant);
    }
  }
  
  // Shuffle options
  const shuffledOptions = options.sort(() => Math.random() - 0.5);
  
  return {
    question,
    answer,
    options: shuffledOptions,
    difficulty,
    numbers,
    operations
  };
};

// Alternative puzzle type: Find the missing operation
const generateMissingOperationPuzzle = (difficulty) => {
  const difficulties = {
    easy: { range: [1, 20], operations: ['+', '-'] },
    medium: { range: [10, 50], operations: ['+', '-', '*'] },
    hard: { range: [20, 100], operations: ['+', '-', '*', '/'] }
  };

  const config = difficulties[difficulty];
  
  // Generate 3 numbers and 1 target result
  const a = Math.floor(Math.random() * (config.range[1] - config.range[0])) + config.range[0];
  const b = Math.floor(Math.random() * (config.range[1] - config.range[0])) + config.range[0];
  const c = Math.floor(Math.random() * (config.range[1] - config.range[0])) + config.range[0];
  
  // Choose 2 operations that will give us a reasonable result
  const op1 = config.operations[Math.floor(Math.random() * config.operations.length)];
  const op2 = config.operations[Math.floor(Math.random() * config.operations.length)];
  
  // Calculate target
  let target = a;
  switch(op1) {
    case '+': target += b; break;
    case '-': target -= b; break;
    case '*': target *= b; break;
    case '/': target = Math.floor(target / b); break;
  }
  
  switch(op2) {
    case '+': target += c; break;
    case '-': target -= c; break;
    case '*': target *= c; break;
    case '/': target = Math.floor(target / c); break;
  }
  
  // Present puzzle with one missing operation
  const missingPos = Math.floor(Math.random() * 2); // 0 or 1
  const operations = [op1, op2];
  const correctOp = operations[missingPos];
  
  let question;
  if (missingPos === 0) {
    question = `${a} ? ${b} ${op2} ${c} = ${target}`;
  } else {
    question = `${a} ${op1} ${b} ? ${c} = ${target}`;
  }
  
  // Options are the available operations
  const options = [...config.operations];
  
  return {
    question,
    answer: correctOp,
    options,
    difficulty,
    type: 'missing_operation'
  };
};

module.exports = { 
  generatePuzzle, 
  generateMissingOperationPuzzle 
};
