const questions = new Map();
const scores = new Map();

export default async function handler(req, res) {
  const { fid, buttonIndex } = req.body.untrustedData;

  // Get current question
  const currentQ = questions.get(fid) || generateQuestion();
  
  // Check answer
  const ops = ['+', '-', '*'];
  const userAnswer = ops[buttonIndex - 2];
  const isCorrect = userAnswer === currentQ.correctOp;

  // Update score
  const userScore = scores.get(fid) || { correct: 0, total: 0 };
  userScore.total++;
  if (isCorrect) userScore.correct++;
  scores.set(fid, userScore);

  // Generate new question
  const newQ = generateQuestion();
  questions.set(fid, newQ);

  // Return next frame
  res.status(200).json({
    frame: generateFrame(fid, newQ, userScore),
  });
}
