const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String, required: [true, "Name is required"],
      trim: true, minlength: 2, maxlength: 50,
    },
    email: {
      type: String, required: [true, "Email is required"],
      unique: true, lowercase: true, trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String, required: [true, "Password is required"],
      minlength: 6, select: false,
    },
    avatar:        { type: String, default: null },
    bio:           { type: String, maxlength: 160, default: "" },
    joinedGroups:  [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
    savedEvents:   [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    role:          { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
