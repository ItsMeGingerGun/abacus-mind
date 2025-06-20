export default async function handler(req, res) {
  const { fid } = req.query;
  
  // Check if user exists in your DB
  const userExists = await checkUserExists(fid); // Implement this DB check
  
  res.status(200).json({ 
    needsAuth: !userExists 
  });
}
