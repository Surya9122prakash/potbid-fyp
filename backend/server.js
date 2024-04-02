require("./config/db");
const app = require("express")();
const port = 5000;
const UserRouter = require("./api/User");
const ContractRouter = require("./api/Contract");
const ComplainSchema = require("./api/Complain");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const User = require("./models/UserSchema");
const bcrypt = require("bcrypt");
const validRoles = ["public", "company", "admin"];
const UserVerification = require("./models/UserVerificationSchema");
const PasswordReset = require("./models/PasswordReset");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { protect, checkUser } = require("./middleware/authMiddleware");
const mongoose = require("mongoose");
const Contract = require("./models/ContractSchma");
const Complain = require("./models/ComplainSchema");
const PredictPrice = require("./models/PredictPriceSchema");

const bodyParser = require("express").json;
const corsOptions = {
  origin: "http://localhost:5173", // Update with your frontend URL
  credentials: true,
};

app.use(cors(corsOptions));

app.options("/user/logout", cors(corsOptions));


app.use(bodyParser());

app.use(cookieParser());

const geneJWT = (email, res) => {
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return token;
};

let transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready for Messages");
    console.log(success);
  }
});

// app.use("/user", UserRouter);

app.use(express.static(path.join(__dirname, 'views')));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.get("/",(req,res)=>{
  res.send("Hi")
})


app.post("/user/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check for empty fields
    if (!name || !email || !password || !role) {
      return res.json({
        status: "FAILED",
        message: "Empty input Fields!",
      });
    }

    // Validate email format
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
      return res.json({
        status: "FAILED",
        message: "Invalid Email Entered",
      });
    }

    // Check password length
    if (password.length < 8) {
      return res.json({
        status: "FAILED",
        message: "Password is Too Short!",
      });
    }

    // Check valid role
    if (!validRoles.includes(role)) {
      return res.json({
        status: "FAILED",
        message:
          "The role is Invalid, only 'public', 'company' and 'admin' are allowed",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        status: "FAILED",
        message: "User Already Exists",
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user instance
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      verified: false,
    });

    // Save user data
    const savedUser = await newUser.save();

    // Send verification email
    sendVerificationEmail(savedUser, res);

    // Respond with success message
    return res.json({
      status: "SUCCESS",
      message: "Signup Successful!!",
      data: savedUser,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      status: "FAILED",
      message: "An error occurred while creating the user",
    });
  }
});

const sendVerificationEmail = ({ _id, email }, res) => {
  const currentUrl = "http://localhost:5000/";
  const uniqueString = uuidv4() + _id;

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Please Verify your email address to complete the signup and login into your account</p>
          <p>This Link <b>expires in 6 hours</b>.</p>
          <p>Press <a href=${currentUrl + "user/verify/" + _id + "/" + uniqueString
      }>here</a> to proceed</p>`,
  };

  const saltRounds = 10;
  bcrypt
    .hash(uniqueString, saltRounds)
    .then((hashedUniqueString) => {
      const newVerification = new UserVerification({
        userId: _id,
        uniqueString: hashedUniqueString,
        createdAt: Date.now(),
        expiresAt: Date.now() + 21600000,
      });

      newVerification
        .save()
        .then(() => {
          transporter
            .sendMail(mailOptions)
            .then(() => {
              res.json({
                status: "PENDING",
                message: "Verification Email Sent",
              });
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((err) => {
      console.error(err);
    });
};

app.get("/user/verify/:userId/:uniqueString", (req, res) => {
  let { userId, uniqueString } = req.params;

  UserVerification.find({ userId })
    .then((result) => {
      if (result.length === 0) {
        let message =
          "Account doesn't exist or has been verified already. Please Signup or Login";
        return res.redirect(`/user/verified/error=true&message=${message}`);
      }

      const { expiresAt, uniqueString: hashedUniqueString } = result[0];

      if (expiresAt < Date.now()) {
        UserVerification.deleteOne({ userId })
          .then(() => {
            User.deleteOne({ _id: userId })
              .then(() => {
                let message = "Link has expired. Please Signup Again.";
                return res.redirect(
                  `/user/verified/error=true&message=${message}`
                );
              })
              .catch((err) => {
                console.error(err);
                let message = "Clearing user with expired unique string failed";
                return res.redirect(
                  `/user/verified/error=true&message=${message}`
                );
              });
          })
          .catch((err) => {
            console.error(err);
            let message =
              "An error occurred while clearing expired user verification record";
            return res.redirect(`/user/verified/error=true&message=${message}`);
          });
      } else {
        bcrypt
          .compare(uniqueString, hashedUniqueString)
          .then((result) => {
            if (result) {
              User.updateOne({ _id: userId }, { verified: true })
                .then(() => {
                  UserVerification.deleteOne({ userId })
                    .then(() => {
                      return res.sendFile(
                        path.join(__dirname, 'views', 'verified.html')
                      );
                    })
                    .catch((err) => {
                      console.error(err);
                      let message =
                        "An error occurred while finalizing successful verification.";
                      return res.redirect(
                        `/user/verified/error=true&message=${message}`
                      );
                    });
                })
                .catch((err) => {
                  console.error(err);
                  let message =
                    "An error occurred while updating user record to show verified.";
                  return res.redirect(
                    `/user/verified/error=true&message=${message}`
                  );
                });
            } else {
              let message =
                "Invalid Verification details passed. Please check your inbox";
              return res.redirect(
                `/user/verified/error=true&message=${message}`
              );
            }
          })
          .catch((err) => {
            let message = "An error occurred while comparing unique strings.";
            return res.redirect(`/user/verified/error=true&message=${message}`);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      let message = "An error occurred while checking the verification record";
      return res.redirect(`/user/verified/error=true&message=${message}`);
    });
});

app.get("/user/verified", (req, res) => {
  return res.sendFile(path.join(__dirname, "./backend/views/verified.html"));
});

app.post("/user/signin", async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if (email === "" || password === "") {
      return res.json({
        status: "FAILED",
        message: "Empty Credentials Supplied",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        status: "INVALID",
        message: "Invalid Credentials Entered!",
      });
    }

    if (!user.verified) {
      return res.json({
        status: "FAILED",
        message: "Email hasn't been verified yet. Check your inbox.",
      });
    }

    const hashedPassword = user.password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    const secret = process.env.JWT_SECRET;
    if (passwordMatch) {
      const token = jwt.sign({ id: user._id }, secret, {
        expiresIn: "3d",
      });
      const { password, ...info } = user._doc;
      res.cookie("token", token).status(200).json({
        status: "SUCCESS",
        message: "Signin Successful",
        data: info,
        token: token,
      });
    } else {
      return res.json({
        status: "FAILED",
        message: "Invalid Password Entered!",
      });
    }
  } catch (error) {
    console.error(error);
    return res.json({
      status: "FAILED",
      message: "An error occurred while processing the request",
    });
  }
});

app.post("/user/requestPasswordReset", (req, res) => {
  const { email, redirectUrl } = req.body;

  User.findOne({ email })
    .then((data) => {
      if (data) {
        if (!data.verified) {
          return res.json({
            status: "FAILED",
            message: "Email hasn't been verified yet. Check your inbox",
          });
        } else {
          sendResetMail(data, redirectUrl, res);
        }
      } else {
        return res.json({
          status: "FAILED",
          message: "No account with the supplied email exists!",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.json({
        status: "FAILED",
        message: "An error occurred while checking for existing user",
      });
    });
});

const sendResetMail = ({ _id, email }, redirectUrl, res) => {
  const resetString = uuidv4() + _id;

  PasswordReset.deleteMany({ userId: _id })
    .then((result) => {
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Password Reset",
        html: `<p>We heard that you lost the password.</p>
                <p>Don't Worry, use the link below to reset it.</p>
                <p>This link <b>expires in 60 minutes</b></p>
                <p>Press <a href=${redirectUrl + "/" + _id + "/" + resetString
          }>here</a> to proceed</p>`,
      };

      const saltRounds = 10;
      bcrypt
        .hash(resetString, saltRounds)
        .then((hashedResetString) => {
          const newPasswordReset = new PasswordReset({
            userId: _id,
            resetString: hashedResetString,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
          });

          newPasswordReset
            .save()
            .then(() => {
              transporter
                .sendMail(mailOptions)
                .then(() => {
                  return res.json({
                    status: "PENDING",
                    message: "Password reset email sent",
                  });
                })
                .catch((err) => {
                  console.error(err);
                  return res.json({
                    status: "FAILED",
                    message: "Password reset email failed!",
                  });
                });
            })
            .catch((err) => {
              console.error(err);
              return res.json({
                status: "FAILED",
                message: "Couldn't save password reset data!",
              });
            });
        })
        .catch((err) => {
          console.error(err);
          return res.json({
            status: "FAILED",
            message: "An error occurred while hashing the password reset data!",
          });
        });
    })
    .catch((err) => {
      console.error(err);
      return res.json({
        status: "FAILED",
        message: "Clearing existing password reset records failed",
      });
    });
};

app.post("/user/resetPassword", async (req, res) => {
  try {
    let { userId, resetString, newPassword } = req.body;

    const result = await PasswordReset.find({ userId });

    if (result.length === 0) {
      return res.json({
        status: "FAILED",
        message: "Password reset request not found.",
      });
    }

    const { expiresAt, resetString: hashedResetString } = result[0];

    if (expiresAt < Date.now()) {
      await PasswordReset.deleteOne({ userId });
      return res.json({
        status: "FAILED",
        message: "Password reset link has expired.",
      });
    }

    const match = await bcrypt.compare(resetString, hashedResetString);

    if (!match) {
      return res.json({
        status: "FAILED",
        message: "Invalid password reset details passed.",
      });
    }

    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    await User.updateOne({ _id: userId }, { password: hashedNewPassword });
    await PasswordReset.deleteOne({ userId });

    return res.json({
      status: "SUCCESS",
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.json({
      status: "FAILED",
      message: "An error occurred while resetting the password.",
    });
  }
});

app.get("/user/log", protect, checkUser, (req, res) => {
  console.log("Inside /log route");
  console.log("req.user:", req.user);

  if (req.user) {
    res.status(200).json({ user: req.user });
  } else {
    res.status(401).json({ message: "User is not authenticated" });
  }
});

app.get("/user/logout", async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", { path: '/' }); // Clear from the root path '/'
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error occurred during logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/user/all", protect,checkUser, async (req, res) => {
  try {
    const currentUserIdentifier = req.user._id; // Assuming the user ID is stored in req.user.id
    const users = await User.find({ _id: { $ne: currentUserIdentifier } }); // Exclude the current user
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

app.get("/user/company", protect, checkUser, async (req, res) => {
  try {
    const companyUsers = await User.find({ role: "company" });
    res.json(companyUsers);
  } catch (error) {
    console.error("Error fetching companyUsers:", error);
    res.status(500).json({ message: "Error fetching companyUsers" });
  }
});

app.get("/user/:userId", protect, checkUser, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error); // Log any errors during request handling
    return res.status(500).json({ message: "Error fetching user" });
  }
});

app.delete("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Error deleting user" });
  }
});

// app.use("/contract", ContractRouter);

app.post("/contract/", protect, checkUser, async (req, res) => {
  try {
    const contract = new Contract(req.body);
    await contract.save();
    res.status(201).send(contract);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/contract/user/:id", protect, checkUser, async (req, res) => {
  try {
    const contracts = await Contract.find({ company_id: req.user.id });
    res.send(contracts);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/contract", protect, checkUser, async (req, res) => {
  try {
    const contracts = await Contract.find();
    res.send(contracts);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/contract/:id", protect, checkUser, async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).send({ message: "Contract not found" });
    }
    res.send(contract);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/contract/:id", protect, checkUser, async (req, res) => {
  try {
    const contract = await Contract.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!contract) {
      return res.status(404).send({ message: "Contract not found" });
    }
    res.send(contract);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete("/contract/:id", protect, checkUser, async (req, res) => {
  try {
    const contract = await Contract.findByIdAndDelete(req.params.id);
    if (!contract) {
      return res.status(404).send({ message: "Contract not found" });
    }
    res.send({ message: "Contract deleted successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
});

// app.use("/complaint", ComplainSchema);

// app.post("/complaint/post", protect, checkUser, async (req, res) => {
//   try {
//     const { userId, name, email, photo, message, location, road, phone } = req.body;
//     const complain = new Complain({ userId, name, email, photo, message, location, road, phone });

//     await complain.save();
//     return res
//       .status(201)
//       .json({ message: "Complaint Saved Successfully", data: complain });
//   } catch (error) {
//     console.error("Error saving complain:", error);
//     return res
//       .status(500)
//       .json({ message: "Error saving complain", error: error.message });
//   }
// });

// Middleware function to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    // User is admin, proceed to the next middleware or route handler
    next();
  } else {
    // User is not admin, return unauthorized status
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Example usage of isAdmin middleware in your route
app.put("/complaint/status/:id", protect, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Your logic to update contract status in the database
    // Example:
    const complaint = await Complain.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    complaint.status = status;
    await complaint.save();

    res.status(200).json({ message: 'Complaint status updated successfully', data: complaint });
  } catch (error) {
    console.error("Error updating complaint status:", error);
    return res.status(500).json({ message: "Error updating complaint status", error: error.message });
  }
});


app.post("/complaint/post", protect, checkUser, async (req, res) => {
  console.log("==========================================================")
  try {
    const { userId, name, email, photo, message, location, road, phone} = req.body;

    // Extract coordinates from the location object
    const coordinates = location.coordinates;

    // Create the complaint with the extracted coordinates
    const complain = new Complain({ userId, name, email, photo, message, location, road, phone });
    complain.location.coordinates = coordinates; // Assign the extracted coordinates

    await complain.save();
    return res
      .status(201)
      .json({ message: "Complaint Saved Successfully", data: complain });
  } catch (error) {
    console.error("Error saving complain:", error);
    return res
      .status(500)
      .json({ message: "Error saving complain", error: error.message });
  }
});


app.get("/complaint", protect, checkUser, async (req, res) => {
  try {
    const userId = req.user._id; // Extract userId from authenticated user
    const complains = await Complain.find({ userId });
    return res.json(complains);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving complains", error: error.message });
  }
});

app.get("/complaint/all", protect, checkUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const complains = await Complain.find({});
    return res.json(complains);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving complains", error: error.message });
  }
});

app.get("/complaint/:id", protect, checkUser, async (req, res) => {
  try {
    const userId = req.user._id; // Extract userId from authenticated user
    const complaint = await Complain.findOne({ _id: req.params.id, userId });
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    return res.json(complaint);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving complaint", error: error.message });
  }
});

app.get("/complaint/one/:id", protect, checkUser, async (req, res) => {
  try {
    const complaint = await Complain.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    return res.json(complaint);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving complaint", error: error.message });
  }
});

app.delete("/complaint/:id", protect, checkUser, async (req, res) => {
  try {
    const userId = req.user._id; // Extract userId from authenticated user
    const deletedComplaint = await Complain.findOneAndDelete({
      _id: req.params.id,
      userId,
    });
    if (!deletedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    return res.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting complaint", error: error.message });
  }
});


app.get('/roads', async (req, res) => {
  try {
    const roads = await Complain.distinct('road');
    res.json({ roads });
  } catch (error) {
    console.error('Error fetching roads:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.post("/predictprice", async (req, res) => {
  try {
    const { road, predicted_price } = req.body;

    const predictPrice = new PredictPrice({
      road,
      predicted_price,
    });

    await predictPrice.save();

    res.status(201).json(predictPrice); 
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/predictprice/roads", async (req, res) => {
  try {
    const roads = await PredictPrice.find().select("road");

    res.json(roads);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/predictprice/:road", async (req, res) => {
  try {
      const road = req.params.road;
      const prediction = await PredictPrice.findOne({ road });

      if (!prediction) {
          return res.status(404).json({ message: "Prediction not found" });
      }

      res.json(prediction);
  } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
  }
});

app.delete("/predictprice/:road", async (req, res) => {
  try {
      const road = req.params.road;

      const deletedPrediction = await PredictPrice.findOneAndDelete({ road });

      if (!deletedPrediction) {
          return res.status(404).json({ message: "Prediction not found" });
      }

      res.json({ message: "Prediction deleted successfully" });
  } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
  }
});



app.listen(port, () => {
  console.log(`Server run on port ${port}`);
});
