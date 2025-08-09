const ApiErrorMessage = {
  // GENERAL
  400: 'API validation failed. Please check your inputs.',
  401: 'File upload failed. Please try again.',
  402: 'An unknown error occurred. Please contact support.',
  403: 'You do not have access to perform this action.',
  404: 'Requested image not found.',

  // COMMON
  501: 'Invalid file type. Please upload a supported file.',
  502: 'You do not have the necessary permissions.',

  // AUTH
  1000: 'Session not found. Please log in again.',
  1001: 'Invalid OTP. Please try again.',
  1002: 'OTP has timed out. Please request a new one.',
  1003: 'Password mismatch. Please check and try again.',
  1004: 'Social ID not found. Please check your account.',
  1005: 'Access token has expired. Please log in again.',
  1006: 'Refresh token has expired. Please log in again.',

  // ADMIN
  1100: 'Admin not found.',
  1101: 'This admin account has been suspended.',
  1102: 'An account with this email already exists.',
  1103: 'This admin account has been deleted.',
  1104: 'You have been blocked by an admin.',
  1105: 'This role already exists.',
  1106: 'An admin already exists for this role.',

  // USER
  1200: 'User not found.',
  1201: 'This user account has been suspended.',
  1202: 'A user with this account already exists.',
  1203: 'This user account has been deleted.',
  1204: 'This user has been blocked by an admin.',
  1206: 'You have been blocked.',
  1207: 'User is already registered.',

  // LANGUAGE
  1301: 'This language already exists.',

  // CATEGORY
  1311: 'This category already exists.',
  1312: 'Category not found..',

  // FAQ
  1381: 'This FAQ already exists.',

  // GLOBAL CONFIG
  1400: 'Global configuration not found.',

  1500: 'Email or password Invalid',
  1501: 'Owner suspended',
  1502: 'Owner email already exists',
  1503: 'Owner has been deleted',
  1504: 'Owner blocked by admin',
  1506: 'Owner already exists for this role',

  1550: 'Restaurant already exists',

  1600: 'Menu already exists',
  1601: 'Menu not found'
};

export default ApiErrorMessage;
