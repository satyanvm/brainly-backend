
import mongoose, {model, Schema} from "mongoose";
mongoose.connect("mongodb+srv://satyanvm7:harekrishna@cluster0.cba1u.mongodb.net/test")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection failed:", err));  

    const userSchema = new Schema({
        username: {type: String, unique: true, required: true},
        password: {type: String, unique: true, required: true}
    })                                                                                                  
                                                                                                        
export const UserModel = model("verygoodusers", userSchema );      
               
const ContentSchema = new Schema({
    title: String,                                                  
    link: String,             
    // tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    type: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true },
    contentId: Number
})  
      
const TwittercontentSchema = new Schema({
    title: String,
    link: String, 
    // tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    type: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true },  
    contentId: Number   
})

const LinkSchema = new Schema({
    hash: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
})         

export const LinkModel = model("Links", LinkSchema);
export const ContentModel = model("Content", ContentSchema);    
export const TwitterContentModel = model("TwitterContents", TwittercontentSchema);