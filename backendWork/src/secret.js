require('dotenv').config();

const serverPort = process.env.SERVER_PORT || 7000;

const mongodbUrl = process.env.MONGODB_ATLAS_URL;

const defaultImagePath = process.env.DEFAULT_USER_IMAGE_PATH || 'public/image/users/default.png';

const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || 'dfgsddfvgff346754546677#$@ghg';
const jwtAccessKey = process.env.JWT_ACCESS_KEY || 'dfgsddfvgff346754546677#$@ghg';
const jwtRefreshKey = process.env.JWT_REFRESH_KEY || 'dfgsddfvgff346754546677#$@ghg';

const jwtResetPasswordKey = process.env.JWT_RESET_PASSWORD_KEY || 'dfgsddfvgff346754546677#$@ghg';

const smtpUserName = process.env.SMTP_USERNAME;
const smtpPassword = process.env.SMTP_PASSWORD;
const storePassword = process.env.STORE_PASSWORD;
const storeId = process.env.STORE_ID;  
// const clientUrl = process.env.CLIENT_URL; 

const clientUrl = [
  '*',
  "http://localhost:5174",
  "http://localhost:5001",
  "https://carenest-backend.onrender.com",
  "https://carenest-avqg.onrender.com"
];


module.exports = {
  serverPort, mongodbUrl, defaultImagePath,
  jwtActivationKey, smtpUserName, smtpPassword, clientUrl, jwtAccessKey,
  jwtResetPasswordKey, jwtRefreshKey, storeId, storePassword
};
