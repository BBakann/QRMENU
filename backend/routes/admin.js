import express from 'express';

const router = express.Router();

//Geçiçi Admin 
const ADMIN_USER = {
    username: "Berdan",
    password: "123456",
};

//Admin Login Route
router.post("/login",(req,res) => {
    const {username,password} = req.body;

    console.log('Admin login attempt:',{username,password});

    if(username == ADMIN_USER.username && password == ADMIN_USER.password){
        res.json({
            success: true,
            message: "Admin login successful",
            token: "admin-token" //TODO: Generate a real token
        });
    } else {
        res.status(401).json({
            success: false,
            message: "Login failed. Please check your credentials",
        });
    }
});

router.get("/profile",(req,res) => {
    res.json({
        username: ADMIN_USER.username,
        message: "Admin profile",
    });
});

export default router;