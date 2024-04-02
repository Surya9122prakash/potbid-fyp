const express = require("express");
const router = express.Router();
const User = require("./../models/UserSchema");
const bcrypt = require("bcrypt");
const validRoles = ["public", "company"];
const UserVerification = require("./../models/UserVerificationSchema");
const PasswordReset = require("./../models/PasswordReset");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

require("dotenv").config();
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

router.post("/signup", (req, res) => {
  let { name, email, password, role } = req.body;
  name = name.trim();
  email = email.trim();
  password = password.trim();
  role = role.trim();
  if (name == "" || email == "" || password == "" || role == "") {
    res.json({
      status: "FAILED",
      message: "Empty input Fields!",
    });
  } else if (!/^[a-zA-z ]*$/.test(name)) {
    res.json({
      status: "FAILED",
      message: "Invalid Name Entered",
    });
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.json({
      status: "FAILED",
      message: "Invalid Email Entered",
    });
  } else if (password.length < 8) {
    res.json({
      status: "FAILED",
      message: "Password is Too Short!",
    });
  } else if (!validRoles.includes(role)) {
    res.json({
      status: "FAILED",
      message: "The role is Invalid only we have two roles (public,company)",
    });
  } else {
    User.find({ email: req.body.email })
      .then((result) => {
        if (result.length) {
          res.json({
            status: "FAILED",
            message: "User Already Exists",
          });
        } else {
          const saltRounds = 10;
          bcrypt
            .hash(password, saltRounds)
            .then((hashedPassword) => {
              const newUser = new User({
                name,
                email,
                password: hashedPassword,
                role,
                verified: false,
              });
              

              newUser
                .save()
                .then((result) => {
                  sendVerificationEmail(result, res);
                  res.status(201).json({ user: result});
                })
                .catch((err) => {
                  res.json({
                    status: "FAILED",
                    message: "An error occured while creating the user",
                  });
                });
            })
            .catch((err) => {
              res.json({
                status: "FAILED",
                message: "An error occured while hashing the password",
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({
          status: "FAILED",
          message: "An error occured while checking for existing user!",
        });
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
              console.log(err);
              res.json({
                status: "FAILED",
                message: "Verification email failed",
              });
            });
        })
        .catch((error) => {
          console.log(error);
          res.json({
            status: "FAILED",
            message: "Couldn't save verification email data!",
          });
        });
    })
    .catch(() => {
      res.json({
        status: "FAILED",
        message: "An error occured while hashing email data!",
      });
    });
};

router.get("/verify/:userId/:uniqueString", (req, res) => {
  let { userId, uniqueString } = req.params;

  UserVerification.find({ userId })
    .then((result) => {
      if (result.length > 0) {
        const { expiresAt } = result[0];
        const hashedUniqueString = result[0].uniqueString;
        if (expiresAt < Date.now()) {
          UserVerification.deleteOne({ userId })
            .then((result) => {
              User.deleteOne({ _id: userId })
                .then(() => {
                  let message = "Link has been expired. Please Signup Again.";
                  res.redirect(`/user/verified/error=true&message=${message}`);
                })
                .catch((err) => {
                  console.log(err);
                  let message =
                    "Clearing user with expired unique string failed";
                  res.redirect(`/user/verified/error=true&message=${message}`);
                });
            })
            .catch((err) => {
              console.log(err);
              let message =
                "An error occured while clearing expired user verification record";
              res.redirect(`/user/verified/error=true&message=${message}`);
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
                        res.sendFile(
                          path.join(__dirname, "./../views/verified.html")
                        );
                      })
                      .catch((err) => {
                        console.log(err);
                        let message =
                          "An error occured while finalizing successful verification.";
                        res.redirect(
                          `/user/verified/error=true&message=${message}`
                        );
                      });
                  })
                  .catch((err) => {
                    console.log(err);
                    let message =
                      "An error occured while updating user record to show verified.";
                    res.redirect(
                      `/user/verified/error=true&message=${message}`
                    );
                  });
              } else {
                let message =
                  "Invalid Verification details passed. Please check your inbox";
                res.redirect(`/user/verified/error=true&message=${message}`);
              }
            })
            .catch((err) => {
              let message = "An error occured while comparing unique strings.";
              res.redirect(`/user/verified/error=true&message=${message}`);
            });
        }
      } else {
        let message =
          "Account doesn't exist or has been verified already. Please Signup or Login";
        res.redirect(`/user/verified/error=true&message=${message}`);
      }
    })
    .catch((error) => {
      console.log(error);
      let message = "An occured while checking the verification record";
      res.redirect(`user/verified/error=true&message=${message}`);
    });
});

router.get("/verified", (req, res) => {
  res.sendFile(path.join(__dirname, "./../views/verified.html"));
});

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
    } else {
      const hashedPassword = user.password;
      bcrypt.compare(password, hashedPassword).then((ress) => {
        if (ress == true) {
          return res.json({
            status: "SUCCESS",
            message: "Signin Successful",
            data: user,
          });
        } else {
          return res.json({
            status: "FAILED",
            message: "Invalid Password Entered!",
          });
        }
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

  User.find({ email })
    .then((data) => {
      if (data.length) {
        if (!data[0].verified) {
          res.json({
            status: "FAILED",
            message: "Email hasn't been verified yet. Check your inbox",
          });
        } else {
          sendResetMail(data[0], redirectUrl, res);
        }
      } else {
        res.json({
          status: "FAILED",
          message: "No account with the supplied email exists!",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: "FAILED",
        message: "An error occured while checking for existing user",
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
                      <p>Don'y Worry, use the link below to reset it.</p>
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
                  res.json({
                    status: "PENDING",
                    message: "Password reset email sent",
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.json({
                    status: "FAILED",
                    message: "Password reset email failed!",
                  });
                });
            })
            .catch((err) => {
              console.log(err);
              res.json({
                status: "FAILED",
                message: "Couldn't save password reset data!",
              });
            });
        })
        .catch((err) => {
          console.log(err);
          res.json({
            status: "FAILED",
            message: "An error occured while hashing the password reset data!",
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: "FAILED",
        message: "Clearing existing password reset records failed",
      });
    });
};

router.post("/resetPassword", (req, res) => {
  let { userId, resetString, newPassword } = req.body;
  PasswordReset.find({ userId })
    .then((result) => {
      if (result.length > 0) {
        const { expiresAt } = result[0];
        const hashedResetString = result[0].resetString;

        if (expiresAt < Date.now()) {
          PasswordReset.deleteOne({ userId })
            .then(() => {
              res.json({
                status: "FAILED",
                message: "Password reset link has expired.",
              });
            })
            .catch((err) => {
              console.log(err);
              res.json({
                status: "FAILED",
                message: "Clearing password reset record failed.",
              });
            });
        } else {
          bcrypt
            .compare(resetString, hashedResetString)
            .then((result) => {
              if (result) {
                const saltRounds = 10;
                bcrypt
                  .hash(newPassword, saltRounds)
                  .then((hashedNewPassword) => {
                    User.updateOne(
                      { _id: userId },
                      { password: hashedNewPassword }
                    )
                      .then(() => {
                        PasswordReset.deleteOne({ userId })
                          .then(() => {
                            res.json({
                              status: "SUCCESS",
                              message: "Password has been reset successfully.",
                            });
                          })
                          .catch((err) => {
                            console.log(err);
                            res.json({
                              status: "FAILED",
                              message:
                                "An error occured while finalizing password reset.",
                            });
                          });
                      })
                      .catch((err) => {
                        console.log(err);
                        res.json({
                          status: "FAILED",
                          message: "Updating user password failed.",
                        });
                      });
                  })
                  .catch((err) => {
                    console.log(err);
                    res.json({
                      status: "FAILED",
                      message: "An error occured while hashing new password.",
                    });
                  });
              } else {
                res.json({
                  status: "FAILED",
                  message: "Invalid password reset details passed.",
                });
              }
            })
            .catch((err) => {
              res.json({
                status: "FAILED",
                message: "Comparing password reset strings failed.",
              });
            });
        }
      } else {
        res.json({
          status: "FAILED",
          message: "Password reset request not found.",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: "FAILED",
        message: "Checking for existing password reset records failed",
      });
    });
});

module.exports = router;
