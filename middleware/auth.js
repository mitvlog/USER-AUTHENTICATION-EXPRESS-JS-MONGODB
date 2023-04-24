const jwt=require('jsonwebtoken');
const Mittal=require('../model/user')

var auth = async (req, res, next) => {
    let token
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
      try {
        // Get Token from header
        token = authorization.split(' ')[1]
  
        // Verify Token
        const { userID } = jwt.verify(token, 'secret')
  
        // Get User from Token
        req.user = await Mittal.findById(userID).select('-password')
  
        next()
      } catch (error) {
        console.log(error)
        res.status(401).send({ "status": "failed", "message": "Unauthorized User" })
      }
    }
    if (!token) {
      res.status(401).send({ "status": "failed", "message": "Unauthorized User, No Token" })
    }
  }

module.exports=auth;