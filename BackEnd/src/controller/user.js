const User = require('../models/user.js');

module.exports.getMe = async (req, res)=>{
try{
    const currentId = req.user._id;
    const user = await  User.findOne({_id: currentId});
    if(!user){
        return res.status(404).json({
            code: 1,
            error: 'can not find user'
        })
    }
    return res.status(200).json({
        code: 0,
        data: user
    })
} catch (error) {
    return  res.status(500).json({
        code: 1,
        error: error.message
    })
}

}