const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  });

const createAndSendToken = (res, user, statusCode) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 3600 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });
  // const url = `${req.protocol}://${req.get('host')}/me`;
  const url = `${req.protocol}://localhost:3000/me`;
  await new Email(newUser, url).sendWelcome();
  createAndSendToken(res, newUser, 201);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.verifyPassword(password, user.password)))
    return next(new AppError('Incorrect email or password', 401));
  createAndSendToken(res, user, 200);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success', token: 'loggedout' });
}

exports.protect = catchAsync(async (req, res, next) => {
  let token = undefined;
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token || token === 'loggedout') {
    return next(
      new AppError(
        'You are not logged in, i.e., the authorization header is missing',
        401
      )
    );
  }
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  const loginUser = await User.findById(decodedToken.id);
  if (!loginUser)
    return next(new AppError('The user does no longer exist.', 401));
  if (loginUser.changedPassword(decodedToken.iat))
    return next(
      new AppError('The password has changed, please login again!', 401)
    );
  req.user = loginUser;
  res.locals.user = loginUser;
  next();
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  const token = req.cookies?.jwt;
  if (token && token !== 'loggedout') {
    const decodedToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );
    const loginUser = await User.findById(decodedToken.id);
    if (loginUser && !loginUser.changedPassword(decodedToken.iat))
      res.locals.user = loginUser;
  }
  next();
});

exports.restrictTo = function (...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError('There is no user for that email', 404));
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? ...submit a PATCH request with your new password and passwordConfirm to ${resetURL}. \nIf you did not request a new password, please ignore this email`;
  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Your password reset token (only valid for 10min)',
    //   message,
    // });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error delivering the reset email. Please, try again later!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user)
    return next(
      new AppError('Token either is invalid or has already expired', 400)
    );
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createAndSendToken(res, user, 200);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.verifyPassword(req.body.passwordCurrent, user.password)))
    return next(new AppError('Incorrect old password!', 401));
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  createAndSendToken(res, user, 200);
});
