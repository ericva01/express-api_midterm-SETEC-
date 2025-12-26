// const User = require("../models/userModel");

// exports.getUser_eric = async (req, res) => {
//   try {
//     const user = await User.findByPk(req.params.id);
//     if (user) {
//       res.json(user);
//     } else {
//       res.status(404).json({ error: "User not found" });
//     }
//   } catch (err) {
//     console.error("Error fetching user:", err);
//     res
//       .status(500)
//       .json({ error: "An error occurred while fetching the user" });
//   }
// };
// exports.getUsers_eric = async (req, res) => {
//   try {
//     const users = await User.findAll();
//     res.json(users);
//   } catch (err) {
//     console.error("Error fetching users:", err);
//     res.status(500).json({ error: "An error occurred while fetching users" });
//   }
// };
// exports.createUser_eric = async (req, res) => {
//   try {
//     const newUser = await User.create({
//       username: req.body.username,
//       userpassword: req.body.userpassword,
//     });
//     res.status(201).json(newUser);
//   } catch (err) {
//     console.error("Error creating user:", err);
//     res
//       .status(500)
//       .json({ error: "An error occurred while creating the user" });
//   }
// };
// exports.updateUser_eric = async (req, res) => {
//   try {
//     const user = await User.findByPk(req.params.id);
//     if (user) {
//       user.username = req.body.username || user.username;
//       user.password = req.body.password || user.password;
//       await user.save();
//       res.json(user);
//     } else {
//       res.status(404).json({ error: "User not found" });
//     }
//   } catch (err) {
//     console.error("Error updating user:", err);
//     res
//       .status(500)
//       .json({ error: "An error occurred while updating the user" });
//   }
// };
// exports.deleteUser_eric = async (req, res) => {
//   try {
//     const user = await User.findByPk(req.params.id);
//     if (user) {
//       await user.destroy();
//       res.json({ message: "User deleted successfully" });
//     } else {
//       res.status(404).json({ error: "User not found" });
//     }
//   } catch (err) {
//     console.error("Error deleting user:", err);
//     res
//       .status(500)
//       .json({ error: "An error occurred while deleting the user" });
//   }
// };


const User = require("../models/userModel");
const bcrypt = require("bcrypt"); // Assuming you're using bcrypt for password hashing

// Validation helper functions
const validateId = (id) => {
  if (!id) {
    return { valid: false, message: "User ID is required" };
  }
  if (isNaN(id) || parseInt(id) <= 0) {
    return { valid: false, message: "User ID must be a positive integer" };
  }
  return { valid: true };
};

const validateUsername = (username) => {
  if (!username) {
    return { valid: false, message: "Username is required" };
  }
  if (typeof username !== 'string') {
    return { valid: false, message: "Username must be a string" };
  }
  if (username.trim().length === 0) {
    return { valid: false, message: "Username cannot be empty or whitespace only" };
  }
  if (username.trim().length < 3) {
    return { valid: false, message: "Username must be at least 3 characters long" };
  }
  if (username.length > 50) {
    return { valid: false, message: "Username cannot exceed 50 characters" };
  }
  
  // Username should only contain alphanumeric characters, underscores, and hyphens
  const usernamePattern = /^[a-zA-Z0-9_-]+$/;
  if (!usernamePattern.test(username.trim())) {
    return { valid: false, message: "Username can only contain letters, numbers, underscores, and hyphens" };
  }
  
  return { valid: true };
};

const validatePassword = (password, isUpdate = false) => {
  // For updates, password is optional
  if (isUpdate && (password === undefined || password === null)) {
    return { valid: true };
  }

  if (!password) {
    return { valid: false, message: "Password is required" };
  }
  if (typeof password !== 'string') {
    return { valid: false, message: "Password must be a string" };
  }
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters long" };
  }
  if (password.length > 100) {
    return { valid: false, message: "Password cannot exceed 100 characters" };
  }
  
  // Password strength validation
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
    return { 
      valid: false, 
      message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" 
    };
  }
  
  return { valid: true };
};

/**
 * GET user by ID
 */
exports.getUser_eric = async (req, res) => {
  try {
    // Validate ID
    const idValidation = validateId(req.params.id);
    if (!idValidation.valid) {
      return res.status(400).json({
        statuscode: 400,
        message: idValidation.message,
        data: null
      });
    }

    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['userpassword'] } // Exclude password from response
    });
    
    if (user) {
      res.status(200).json({
        statuscode: 200,
        message: "Successfully retrieved user",
        data: user
      });
    } else {
      res.status(404).json({
        statuscode: 404,
        message: "User not found",
        data: null
      });
    }
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({
      statuscode: 500,
      message: "An error occurred while fetching the user",
      data: null
    });
  }
};

/**
 * GET all users
 */
exports.getUsers_eric = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['userpassword'] } // Exclude passwords from response
    });
    
    res.status(200).json({
      statuscode: 200,
      message: "Successfully retrieved users",
      data: users
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({
      statuscode: 500,
      message: "An error occurred while fetching users",
      data: null
    });
  }
};

/**
 * CREATE user
 */
exports.createUser_eric = async (req, res) => {
  try {
    const { username, userpassword } = req.body;

    // Validate username
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      return res.status(400).json({
        statuscode: 400,
        message: usernameValidation.message,
        data: null
      });
    }

    // Validate password
    const passwordValidation = validatePassword(userpassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        statuscode: 400,
        message: passwordValidation.message,
        data: null
      });
    }

    // Check for duplicate username
    const existingUser = await User.findOne({
      where: { username: username.trim() }
    });

    if (existingUser) {
      return res.status(409).json({
        statuscode: 409,
        message: "A user with this username already exists",
        data: null
      });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(userpassword, 10);

    const newUser = await User.create({
      username: username.trim(),
      userpassword: hashedPassword,
    });

    // Remove password from response
    const userResponse = newUser.toJSON();
    delete userResponse.userpassword;

    res.status(201).json({
      statuscode: 201,
      message: "User created successfully",
      data: userResponse
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({
      statuscode: 500,
      message: "An error occurred while creating the user",
      data: null,
      details: err.message
    });
  }
};

/**
 * UPDATE user
 */
exports.updateUser_eric = async (req, res) => {
  try {
    // Validate ID
    const idValidation = validateId(req.params.id);
    if (!idValidation.valid) {
      return res.status(400).json({
        statuscode: 400,
        message: idValidation.message,
        data: null
      });
    }

    // Validate username if provided
    if (req.body.username !== undefined) {
      const usernameValidation = validateUsername(req.body.username);
      if (!usernameValidation.valid) {
        return res.status(400).json({
          statuscode: 400,
          message: usernameValidation.message,
          data: null
        });
      }
    }

    // Validate password if provided (note: the field name inconsistency - userpassword vs password)
    const passwordField = req.body.userpassword || req.body.password;
    if (passwordField !== undefined) {
      const passwordValidation = validatePassword(passwordField, true);
      if (!passwordValidation.valid) {
        return res.status(400).json({
          statuscode: 400,
          message: passwordValidation.message,
          data: null
        });
      }
    }

    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        statuscode: 404,
        message: "User not found",
        data: null
      });
    }

    // Check for duplicate username if updating username
    if (req.body.username !== undefined && req.body.username.trim() !== user.username) {
      const existingUser = await User.findOne({
        where: { username: req.body.username.trim() }
      });

      if (existingUser) {
        return res.status(409).json({
          statuscode: 409,
          message: "A user with this username already exists",
          data: null
        });
      }
    }

    // Update fields
    if (req.body.username !== undefined) {
      user.username = req.body.username.trim();
    }
    
    // Handle password update with hashing
    if (passwordField !== undefined) {
      const hashedPassword = await bcrypt.hash(passwordField, 10);
      user.userpassword = hashedPassword;
    }

    await user.save();

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.userpassword;
    
    res.status(200).json({
      statuscode: 200,
      message: "User updated successfully",
      data: userResponse
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({
      statuscode: 500,
      message: "An error occurred while updating the user",
      data: null
    });
  }
};

/**
 * DELETE user
 */
exports.deleteUser_eric = async (req, res) => {
  try {
    // Validate ID
    const idValidation = validateId(req.params.id);
    if (!idValidation.valid) {
      return res.status(400).json({
        statuscode: 400,
        message: idValidation.message,
        data: null
      });
    }

    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        statuscode: 404,
        message: "User not found",
        data: null
      });
    }

    await user.destroy();
    
    res.status(200).json({
      statuscode: 200,
      message: "User deleted successfully",
      data: null
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({
      statuscode: 500,
      message: "An error occurred while deleting the user",
      data: null
    });
  }
};