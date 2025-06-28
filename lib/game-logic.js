// Generate puzzles by difficulty
const generatePuzzle = (difficulty) => {
  const difficulties = {
    easy: { range: [1, 10], operators: ['+', '-'] },
    medium: { range: [10, 50], operators: ['+', '-', '*'] },
    hard: { range: [50, 100], operators: ['+', '-', '*', '/'] }
  };

  const config = difficulties[difficulty];
  const a = Math.floor(Math.random() * (config.range[1] - config.range[0])) + config.range[0];
  const b = Math.floor(Math.random() * (config.range[1] - config.range[0])) + config.range[0];
  const op = config.operators[Math.floor(Math.random() * config.operators.length)];

  let question, answer;
  
  switch(op) {
    case '+': 
      question = `${a} + ${b} = ?`;
      answer = a + b;
      break;
    case '-':
      question = `${a} - ${b} = ?`;
      answer = a - b;
      break;
    case '*':
      question = `${a} × ${b} = ?`;
      answer = a * b;
      break;
    case '/':
      // Ensure integer division
      question = `${a * b} ÷ ${a} = ?`;
      answer = b;
      break;
  }

  // Generate 4 options
  const options = [answer];
  while(options.length < 4) {
    const offset = Math.floor(Math.random() * 10) + 1;
    const variant = answer + (Math.random() > 0.5 ? offset : -offset);
    if(!options.includes(variant)) options.push(variant);
  }

  // Shuffle options
  return {
    question,
    answer,
    options: options.sort(() => Math.random() - 0.5),
    difficulty
  };
};

module.exports = { generatePuzzle };
