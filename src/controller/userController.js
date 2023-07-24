import jwt from 'jsonwebtoken'

//login
export const login = (req,res,next) =>{
    const user = {
        name: 'arslan',
        favColor: 'black',
        id:'1233445'
    }
    try {
        const token = jwt.sign({ user: user }, "secret", {
            expiresIn: "1d",
          });

        res.status(200).json({message:'Successfully logedin',token})
    } catch (error) {
        next(error)
    }

}



//get all users
export const getUsers = (req,res,next) =>{
try {
    res.status(200).json({message:'get all users'})
} catch (error) {
    next(error)
}
}