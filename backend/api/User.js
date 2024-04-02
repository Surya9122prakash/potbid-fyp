const express = require("express");
const router = express.Router();
const User = require("./../models/UserSchema");
const bcrypt = require("bcrypt");
const validRoles = ["public", "company", "admin"];
const UserVerification = require("./../models/UserVerificationSchema");
const PasswordReset = require("./../models/PasswordReset");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { protect, checkUser } = require("../middleware/authMiddleware");
const mongoose = require("mongoose")

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

// router.post("/signup", async (req, res) => {
//   let { name, email, password, role } = req.body;
//   name = name.trim();
//   email = email.trim();
//   password = password.trim();
//   role = role.trim();

//   if (name === "" || email === "" || password === "" || role === "") {
//     return res.json({
//       status: "FAILED",
//       message: "Empty input Fields!",
//     });
//   } else if (!/^[a-zA-z ]*$/.test(name)) {
//     return res.json({
//       status: "FAILED",
//       message: "Invalid Name Entered",
//     });
//   } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
//     return res.json({
//       status: "FAILED",
//       message: "Invalid Email Entered",
//     });
//   } else if (password.length < 8) {
//     return res.json({
//       status: "FAILED",
//       message: "Password is Too Short!",
//     });
//   } else if (!validRoles.includes(role)) {
//     return res.json({
//       status: "FAILED",
//       message: "The role is Invalid, only 'public' and 'company' are allowed",
//     });
//   }

//   try {
//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       return res.json({
//         status: "FAILED",
//         message: "User Already Exists",
//       });
//     }

//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       verified: false,
//     });
//     newUser.token=geneJWT(email)

//     const savedUser = await newUser.save();
//     sendVerificationEmail(savedUser, res);
//     if(savedUser){
//       res.json({
//         status:"SUCCESS",
//         message:"Signup Successful!!",
//         data:savedUser
//       })
//     }
//   } catch (error) {
//     console.error(error);
//     return res.json({
//       status: "FAILED",
//       message: "An error occurred while creating the user",
//     });
//   }
// });

router.post("/signup", async (req, res) => {
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
        message: "The role is Invalid, only 'public', 'company' and 'admin' are allowed",
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

// const sendVerificationEmail = ({ _id, email }, res) => {
//   const currentUrl = "http://localhost:5000/";
//   const uniqueString = uuidv4() + _id;

//   const mailOptions = {
//     from: process.env.AUTH_EMAIL,
//     to: email,
//     subject: "Verify Your Email",
//     html: `<p>Please Verify your email address to complete the signup and login into your account</p>
//           <p>This Link <b>expires in 6 hours</b>.</p>
//           <p>Press <a href=${currentUrl + "user/verify/" + _id + "/" + uniqueString}>here</a> to proceed</p>`,
//   };

//   const saltRounds = 10;
//   bcrypt
//     .hash(uniqueString, saltRounds)
//     .then((hashedUniqueString) => {
//       const newVerification = new UserVerification({
//         userId: _id,
//         uniqueString: hashedUniqueString,
//         createdAt: Date.now(),
//         expiresAt: Date.now() + 21600000,
//       });

//       newVerification
//         .save()
//         .then(() => {
//           transporter
//             .sendMail(mailOptions)
//             .then(() => {
//               return res.json({
//                 status: "PENDING",
//                 message: "Verification Email Sent",
//               });
//             })
//             .catch((err) => {
//               console.error(err);
//               return res.json({
//                 status: "FAILED",
//                 message: "Verification email failed",
//               });
//             });
//         })
//         .catch((error) => {
//           console.error(error);
//           return res.json({
//             status: "FAILED",
//             message: "Couldn't save verification email data!",
//           });
//         });
//     })
//     .catch((err) => {
//       console.error(err);
//       return res.json({
//         status: "FAILED",
//         message: "An error occurred while hashing email data!",
//       });
//     });
// };

// router.get("/verify/:userId/:uniqueString", (req, res) => {
//   let { userId, uniqueString } = req.params;

//   UserVerification.find({ userId })
//     .then((result) => {
//       if (result.length > 0) {
//         const { expiresAt, uniqueString: hashedUniqueString } = result[0];

//         if (expiresAt < Date.now()) {
//           UserVerification.deleteOne({ userId })
//             .then((result) => {
//               User.deleteOne({ _id: userId })
//                 .then(() => {
//                   let message = "Link has been expired. Please Signup Again.";
//                   return res.redirect(`/user/verified/error=true&message=${message}`);
//                 })
//                 .catch((err) => {
//                   console.error(err);
//                   let message = "Clearing user with expired unique string failed";
//                   return res.redirect(`/user/verified/error=true&message=${message}`);
//                 });
//             })
//             .catch((err) => {
//               console.error(err);
//               let message = "An error occurred while clearing expired user verification record";
//               return res.redirect(`/user/verified/error=true&message=${message}`);
//             });
//         } else {
//           bcrypt
//             .compare(uniqueString, hashedUniqueString)
//             .then((result) => {
//               if (result) {
//                 User.updateOne({ _id: userId }, { verified: true })
//                   .then(() => {
//                     UserVerification.deleteOne({ userId })
//                       .then(() => {
//                         return res.sendFile(path.join(__dirname, "./../views/verified.html"));
//                       })
//                       .catch((err) => {
//                         console.error(err);
//                         let message = "An error occurred while finalizing successful verification.";
//                         return res.redirect(`/user/verified/error=true&message=${message}`);
//                       });
//                   })
//                   .catch((err) => {
//                     console.error(err);
//                     let message = "An error occurred while updating user record to show verified.";
//                     return res.redirect(`/user/verified/error=true&message=${message}`);
//                   });
//               } else {
//                 let message = "Invalid Verification details passed. Please check your inbox";
//                 return res.redirect(`/user/verified/error=true&message=${message}`);
//               }
//             })
//             .catch((err) => {
//               let message = "An error occurred while comparing unique strings.";
//               return res.redirect(`/user/verified/error=true&message=${message}`);
//             });
//         }
//       } else {
//         let message = "Account doesn't exist or has been verified already. Please Signup or Login";
//         return res.redirect(`/user/verified/error=true&message=${message}`);
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//       let message = "An error occurred while checking the verification record";
//       return res.redirect(`user/verified/error=true&message=${message}`);
//     });
// });

const sendVerificationEmail = ({ _id, email }, res) => {
  const currentUrl = "http://localhost:5000/";
  const uniqueString = uuidv4() + _id;

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Please Verify your email address to complete the signup and login into your account</p>
          <p>This Link <b>expires in 6 hours</b>.</p>
          <p>Press <a href=${
            currentUrl + "user/verify/" + _id + "/" + uniqueString
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

router.get("/verify/:userId/:uniqueString", (req, res) => {
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
                        path.join(__dirname, "./../views/verified.html")
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

router.get("/verified", (req, res) => {
  return res.sendFile(path.join(__dirname, "./../views/verified.html"));
});

// router.post("/signin", async (req, res) => {
//   try {
//     let { email, password } = req.body;
//     email = email.trim();
//     password = password.trim();

//     if (email === "" || password === "") {
//       return res.json({
//         status: "FAILED",
//         message: "Empty Credentials Supplied",
//       });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.json({
//         status: "INVALID",
//         message: "Invalid Credentials Entered!",
//       });
//     }

//     if (!user.verified) {
//       return res.json({
//         status: "FAILED",
//         message: "Email hasn't been verified yet. Check your inbox.",
//       });
//     }

//     const hashedPassword = user.password;
//     const passwordMatch = await bcrypt.compare(password, hashedPassword);
//     const secret = process.env.JWT_SECRET;
//     if (passwordMatch) {
//       const token = jwt.sign(
//         { _id: user._id, name: user.name, email: user.email },
//         secret,
//         {
//           expiresIn: "3d",
//         }
//       );
//       const { password, ...info } = user._doc;
//       res.cookie("token", token).status(200).json(info);

//       return res.json({
//         status: "SUCCESS",
//         message: "Signin Successful",
//         data: user,
//         token: token,
//       });
//     } else {
//       return res.json({
//         status: "FAILED",
//         message: "Invalid Password Entered!",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.json({
//       status: "FAILED",
//       message: "An error occurred while processing the request",
//     });
//   }
// });
router.post("/signin", async (req, res) => {
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
      const token = jwt.sign(
        { id: user._id },
        secret,
        {
          expiresIn: "3d",
        }
      );
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

router.post("/requestPasswordReset", (req, res) => {
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
                <p>Press <a href=${
                  redirectUrl + "/" + _id + "/" + resetString
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

router.post("/resetPassword", async (req, res) => {
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

router.get("/log", protect,checkUser, (req, res) => {
  console.log("Inside /log route");
  console.log("req.user:", req.user);

  if (req.user) {
    res.status(200).json({ user: req.user });
  } else {
    res.status(401).json({ message: "User is not authenticated" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

router.get("/:userId", async (req, res) => {
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
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Error fetching user" });
  }
});

// Logout route
router.get("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error occurred during logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.delete("/:userId", async (req, res) => {
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

router.get('/company', async (req, res) => {
  try {
    const companyUsers = await User.find({ role: "company" });
    res.send(companyUsers);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;