import { DIFFICULTY } from './constants';

// Generate a math question based on difficulty
export function generateQuestion(difficulty = 'NOVICE') {
  const level = DIFFICULTY[difficulty] || DIFFICULTY.NOVICE;
  const [min, max] = level.range;
  
  // Generate random numbers
  const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
  const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
  
  // Choose random operation
  const operations = ['+', '-', '×'];
  const opIndex = Math.floor(Math.random() * operations.length);
  const op = operations[opIndex];
  
  // Calculate result
  let result;
  switch(op) {
    case '+': result = num1 + num2; break;
    case '-': result = num1 - num2; break;
    case '×': result = num1 * num2; break;
    default: result = num1 + num2;
  }
  
  return {
    num1,
    num2,
    num3: result,
    correctOp: op,
    difficulty
  };
}

// Check if user's answer is correct
export function checkAnswer(question, userAnswer) {
  return question.correctOp === userAnswer;
}
