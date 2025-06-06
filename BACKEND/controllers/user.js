const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const User=require("../models/usermodel");

exports.registerUser=async (req,res) => {
    try {
        const {name,email,password}=req.body;
        let user=await User.findone({email});
        if(user) return res.status(400).json({message:"user already exist!"});
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        user=new User({name,email,password:hashedPassword});
        await user.save();

        res.status(201).json({message:"user registered successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
        
    }
    
};
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
