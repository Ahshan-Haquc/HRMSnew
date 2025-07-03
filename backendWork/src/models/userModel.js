const { Schema, model } = require("mongoose")
const bcrypt = require('bcryptjs');
const userSchema = new Schema({

    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v));
            },
            message: 'Please enter a valid email'
        },
    },

    password: {
        type: String,
        trim: true,
        required: [true, 'Password is required'],
        minlength: [6, 'The length of user password can be minimum 6 characters'],
        set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },

    role: {
        type: String,
        enum: ['admin', 'employee'],
        default: 'employee'
    },

      isActive: { type: Boolean, default: true },



    createAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});


const User = model("Users", userSchema);
module.exports = User;

