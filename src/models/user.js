import mongoose  from "mongoose";

 const userSchema = new mongoose.Schema({
    username:{
         type:String,
         required: true,
         },

    emailId:{
        type : String,
         required: true,
        lowercase :true,
      trim : true,
       unique : true,
    },

    password:{
         type: String,
      required: true,
    },

    role:{
        type:String,
        enum: ["user", "admin", "superadmin"],default: "user" 
    },

    isBlocked: { 
        type: Boolean, default: false }
     }, { timestamps: true });


    export default mongoose.model("User", userSchema);