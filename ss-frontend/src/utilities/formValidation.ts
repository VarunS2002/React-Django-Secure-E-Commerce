import React from 'react';
import type {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
} from 'react';
import { FormModes } from 'utilities/abstractions';
import DOMPurify from 'dompurify';

const focusAndSetCursorToEnd = (id: string, onlyFocus = false): void => {
  const textField = document.getElementById(id);
  if (textField instanceof HTMLTextAreaElement) {
    try {
      textField.focus();
      if (onlyFocus) {
        return;
      }
      const len = textField.value.length;
      textField.setSelectionRange(len, len);
    } catch {
      const { value } = textField;
      textField.value = '';
      textField.value = value;
    }
  }
};

const cleanData = (userInput: string): string => DOMPurify.sanitize(userInput);

const validateName = (
  event: ChangeEvent<HTMLInputElement>,
  setName: Dispatch<SetStateAction<string>>,
  setNameError: Dispatch<SetStateAction<string>>,
): void => {
  const is2To40Characters = event.target.value.length >= 2 && event.target.value.length <= 40;

  if (is2To40Characters) {
    setNameError('');
    setName(cleanData(event.target.value));
    // eslint-disable-next-line no-param-reassign
    event.target.value = cleanData(event.target.value);
  } else if (event.target.value === '') {
    setNameError('');
    setName('');
  } else {
    setNameError('Name must be 2 to 40 characters long');
    setName('');
  }
};

const validateEmail = (
  event: ChangeEvent<HTMLInputElement>,
  setEmail: Dispatch<SetStateAction<string>>,
  setEmailError: Dispatch<SetStateAction<string>>,
): void => {
  const isEmailFormat = !!event.target.value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
  const isUpTo70Characters = event.target.value.length <= 70;
  const isValidEmail = isEmailFormat && isUpTo70Characters;
  if (isValidEmail) {
    setEmailError('');
    setEmail(cleanData(event.target.value));
    // eslint-disable-next-line no-param-reassign
    event.target.value = cleanData(event.target.value);
  } else if (event.target.value === '') {
    setEmailError('');
    setEmail('');
  } else if (!isUpTo70Characters) {
    setEmailError('Email address cannot be more than 70 characters long');
    setEmail(cleanData(event.target.value));
    // eslint-disable-next-line no-param-reassign
    event.target.value = cleanData(event.target.value);
  } else {
    setEmailError('Invalid email address');
    setEmail(cleanData(event.target.value));
    // eslint-disable-next-line no-param-reassign
    event.target.value = cleanData(event.target.value);
  }
};

const validatePassword = (
  event: ChangeEvent<HTMLInputElement>,
  fieldType: string,
  email: string,
  emailError: string,
  setPassword: Dispatch<SetStateAction<string>>,
  passwordError: string,
  setPasswordError: Dispatch<SetStateAction<string>>,
  mode: FormModes,
): void => {
  if (mode === FormModes.SignIn) {
    if (event.target.value === '') {
      setPassword('');
      setPasswordError('');
    } else {
      setPassword(cleanData(event.target.value));
      // eslint-disable-next-line no-param-reassign
      event.target.value = cleanData(event.target.value);
      setPasswordError('');
    }
  } else if (mode === FormModes.SignUp) {
    if (fieldType === 'password') {
      const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]{6,30}$/;
      const hasNumber = !!event.target.value.match(
        /(?=.*[0-9]).*[a-zA-Z0-9!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]/,
      );
      const hasLowercase = !!event.target.value.match(
        /(?=.*[a-z]).*[a-zA-Z0-9!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]/,
      );
      const hasUppercase = !!event.target.value.match(
        /(?=.*[A-Z]).*[a-zA-Z0-9!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]/,
      );
      const is6To30Characters = event.target.value.length >= 6 && event.target.value.length <= 30;
      const isNotSameAsValidEmail = emailError === '' ? event.target.value !== email : true;
      const isValidPassword = !!event.target.value.match(passwordRegex) && isNotSameAsValidEmail;
      if (event.target.value === '') {
        setPassword('');
        setPasswordError('');
      } else if (isValidPassword) {
        setPassword(cleanData(event.target.value));
        // eslint-disable-next-line no-param-reassign
        event.target.value = cleanData(event.target.value);
        setPasswordError('');
      } else {
        setPassword('');
        if (!hasNumber) {
          setPasswordError('Password must contain at least one digit');
        } else if (!hasLowercase) {
          setPasswordError('Password must contain at least one lowercase letter');
        } else if (!hasUppercase) {
          setPasswordError('Password must contain at least one uppercase letter');
        } else if (!is6To30Characters) {
          setPasswordError('Password must be 6 to 30 characters long');
        } else if (!isNotSameAsValidEmail) {
          setPasswordError('Password cannot be the same as your email address');
        } else {
          setPasswordError('Invalid password');
        }
      }
    } else if (fieldType === 'email') {
      const passwordField = document.getElementById('password');
      if (passwordField instanceof HTMLTextAreaElement) {
        if (event.target.value === passwordField.value && passwordError === '') {
          setPassword('');
          setPasswordError('Password cannot be the same as your email address');
        } else if (passwordError === 'Password cannot be the same as your email address') {
          setPasswordError('');
        }
      }
    }
  }
};

const validateConfirmPassword = (
  event: ChangeEvent<HTMLInputElement>,
  fieldType: string,
  setConfirmPasswordError: Dispatch<SetStateAction<string>>,
): void => {
  if (fieldType === 'password') {
    const confirmPasswordField = document.getElementById('confirmPassword');
    if (confirmPasswordField instanceof HTMLTextAreaElement) {
      if (confirmPasswordField.value === '') {
        setConfirmPasswordError('');
      } else if (event.target.value !== confirmPasswordField.value) {
        setConfirmPasswordError('Passwords do not match');
      } else {
        setConfirmPasswordError('');
      }
    }
  } else if (fieldType === 'confirmPassword') {
    const passwordField = document.getElementById('password');
    if (passwordField instanceof HTMLTextAreaElement) {
      if (event.target.value === '') {
        setConfirmPasswordError('');
      } else if (event.target.value !== passwordField.value) {
        setConfirmPasswordError('Passwords do not match');
      } else {
        setConfirmPasswordError('');
      }
    }
  }
};

const validateBeforeSignIn = (
  event: FormEvent<HTMLFormElement>,
  email: string,
  setEmailError: Dispatch<SetStateAction<string>>,
  password: string,
  setPasswordError: Dispatch<SetStateAction<string>>,
  setShowPassword: Dispatch<SetStateAction<boolean>>,
): boolean => {
  event.preventDefault();
  let isValidForm = true;
  let emailFocused = false;
  setShowPassword(false);
  if (email === '') {
    isValidForm = false;
    const emailField = document.getElementById('email');
    if (emailField instanceof HTMLInputElement) {
      if (emailField.value === '') {
        setEmailError('Email address cannot be empty');
      }
    }
    focusAndSetCursorToEnd('email');
    emailFocused = true;
  }
  if (password === '') {
    isValidForm = false;
    const passwordField = document.getElementById('password');
    if (passwordField instanceof HTMLInputElement) {
      if (passwordField.value === '') {
        setPasswordError('Password cannot be empty');
      }
    }
    if (!emailFocused) {
      focusAndSetCursorToEnd('password');
    }
  }
  return isValidForm;
};

const validateBeforeSignUp = (
  event: FormEvent<HTMLFormElement>,
  accountType: number,
  setAccountTypeError: Dispatch<SetStateAction<string>>,
  firstName: string,
  setFirstNameError: Dispatch<SetStateAction<string>>,
  lastName: string,
  setLastNameError: Dispatch<SetStateAction<string>>,
  email: string,
  setEmailError: Dispatch<SetStateAction<string>>,
  password: string,
  setPasswordError: Dispatch<SetStateAction<string>>,
  setShowPassword: Dispatch<SetStateAction<boolean>>,
  setConfirmPasswordError: Dispatch<SetStateAction<string>>,
  setShowConfirmPassword: Dispatch<SetStateAction<boolean>>,
): boolean => {
  event.preventDefault();
  let isValidForm = true;
  let accountTypeFocused = false;
  let firstNameFocused = false;
  let lastNameFocused = false;
  let emailFocused = false;
  let passwordFocused = false;
  setShowPassword(false);
  setShowConfirmPassword(false);
  if (accountType === Number.POSITIVE_INFINITY) {
    isValidForm = false;
    setAccountTypeError('Please select an account type');
    focusAndSetCursorToEnd('accountType', true);
    accountTypeFocused = true;
  }

  if (firstName === '') {
    isValidForm = false;
    const firstNameField = document.getElementById('firstName');
    if (firstNameField instanceof HTMLInputElement) {
      if (firstNameField.value === '') {
        setFirstNameError('First name cannot be empty');
      }
    }
    focusAndSetCursorToEnd('firstName');
    firstNameFocused = true;
  }
  if (lastName === '') {
    isValidForm = false;
    const lastNameField = document.getElementById('lastName');
    if (lastNameField instanceof HTMLInputElement) {
      if (lastNameField.value === '') {
        setLastNameError('Last name cannot be empty');
      }
    }
    if (!firstNameFocused) {
      focusAndSetCursorToEnd('lastName');
      lastNameFocused = true;
    }
  }
  if (email === '') {
    isValidForm = false;
    const emailField = document.getElementById('email');
    if (emailField instanceof HTMLInputElement) {
      if (emailField.value === '') {
        setEmailError('Email address cannot be empty');
      }
    }
    if (!firstNameFocused && !lastNameFocused) {
      focusAndSetCursorToEnd('email');
      emailFocused = true;
    }
  }
  const passwordField = document.getElementById('password');
  if (password === '') {
    isValidForm = false;
    if (passwordField instanceof HTMLInputElement) {
      if (passwordField.value === '') {
        setPasswordError('Password cannot be empty');
      }
    }
    if (!firstNameFocused && !lastNameFocused && !emailFocused) {
      passwordFocused = true;
      setTimeout(() => focusAndSetCursorToEnd('password'), 0);
    }
  }
  const confirmPasswordField = document.getElementById('confirmPassword');
  if (confirmPasswordField instanceof HTMLInputElement) {
    if (confirmPasswordField.value === '') {
      isValidForm = false;
      setConfirmPasswordError('Confirm password cannot be empty');
      if (!firstNameFocused && !lastNameFocused && !emailFocused && !passwordFocused) {
        focusAndSetCursorToEnd('confirmPassword');
      }
    } else if (passwordField instanceof HTMLInputElement && confirmPasswordField.value !== passwordField.value) {
      isValidForm = false;
      setConfirmPasswordError('Passwords do not match');
      if (!firstNameFocused && !lastNameFocused && !emailFocused && !passwordFocused) {
        setTimeout(() => focusAndSetCursorToEnd('confirmPassword'), 0);
      }
    }
  }
  return isValidForm;
};

const validateOtp = (
  event: ChangeEvent<HTMLInputElement>,
  setOtp: Dispatch<SetStateAction<number>>,
  setOtpError: Dispatch<SetStateAction<string>>,
): void => {
  const isPositiveInteger = !!event.target.value.match(/^\d+$/);
  const correctRange = Number(event.target.value) >= 1000 && Number(event.target.value) <= 9999;
  if (correctRange && isPositiveInteger) {
    setOtpError('');
    setOtp(Number(event.target.value));
  } else if (event.target.value === '') {
    setOtpError('');
    setOtp(0);
  } else {
    setOtpError('Invalid OTP');
    setOtp(Number(event.target.value));
  }
};

const validateBeforeResetPassword = (
  event: FormEvent<HTMLFormElement>,
  otp: number,
  setOtpError: Dispatch<SetStateAction<string>>,
  password: string,
  setPasswordError: Dispatch<SetStateAction<string>>,
  setShowPassword: Dispatch<SetStateAction<boolean>>,
  setConfirmPasswordError: Dispatch<SetStateAction<string>>,
  setShowConfirmPassword: Dispatch<SetStateAction<boolean>>,
): boolean => {
  event.preventDefault();
  let isValidForm = true;
  let otpFocused = false;
  let passwordFocused = false;
  let confirmPasswordFocused = false;
  setShowPassword(false);
  setShowConfirmPassword(false);
  if (otp === 0) {
    isValidForm = false;
    setOtpError('Invalid OTP');
    focusAndSetCursorToEnd('otp');
    otpFocused = true;
  }
  const passwordField = document.getElementById('password');
  if (password === '') {
    isValidForm = false;
    if (passwordField instanceof HTMLInputElement) {
      if (passwordField.value === '') {
        setPasswordError('Password cannot be empty');
      }
    }
    if (!otpFocused) {
      passwordFocused = true;
      setTimeout(() => focusAndSetCursorToEnd('password'), 0);
    }
  }
  const confirmPasswordField = document.getElementById('confirmPassword');
  if (confirmPasswordField instanceof HTMLInputElement) {
    if (confirmPasswordField.value === '') {
      isValidForm = false;
      setConfirmPasswordError('Confirm password cannot be empty');
      if (!otpFocused && !passwordFocused) {
        setTimeout(() => focusAndSetCursorToEnd('confirmPassword'), 0);
        confirmPasswordFocused = true;
      }
    } else if (passwordField instanceof HTMLInputElement && confirmPasswordField.value !== passwordField.value) {
      isValidForm = false;
      setConfirmPasswordError('Passwords do not match');
      if (!otpFocused && !passwordFocused && !confirmPasswordFocused) {
        setTimeout(() => focusAndSetCursorToEnd('confirmPassword'), 0);
      }
    }
  }
  return isValidForm;
};

const validateFeedback = (
  event: ChangeEvent<HTMLInputElement>,
  setFeedback: Dispatch<SetStateAction<string>>,
  setFeedbackError: Dispatch<SetStateAction<string>>,
): void => {
  if (event.target.value.length <= 1000 && event.target.value.trim().length >= 5) {
    setFeedbackError('');
    setFeedback(cleanData(event.target.value));
    // eslint-disable-next-line no-param-reassign
    event.target.value = cleanData(event.target.value);
  } else if (event.target.value === '') {
    setFeedbackError('');
    setFeedback('');
  } else if (event.target.value.trim().length < 5) {
    setFeedbackError('Feedback must be at least 5 characters long');
    setFeedback('');
  } else {
    setFeedbackError('Feedback cannot be more than 1000 characters long');
    setFeedback(cleanData(event.target.value));
    // eslint-disable-next-line no-param-reassign
    event.target.value = cleanData(event.target.value);
  }
};

const validateAddress = (
  event: ChangeEvent<HTMLInputElement>,
  setAddress: Dispatch<SetStateAction<string>>,
  setAddressError: Dispatch<SetStateAction<string>>,
): void => {
  const isUpTo100Characters = event.target.value.length <= 100;
  if (isUpTo100Characters) {
    setAddressError('');
    setAddress(cleanData(event.target.value));
    // eslint-disable-next-line no-param-reassign
    event.target.value = cleanData(event.target.value);
  } else if (event.target.value === '') {
    setAddressError('');
    setAddress('');
  } else {
    setAddressError('Address must be less than 100 characters');
    setAddress('');
  }
};

const validateZip = (
  event: ChangeEvent<HTMLInputElement>,
  setZip: Dispatch<SetStateAction<string>>,
  setZipError: Dispatch<SetStateAction<string>>,
): void => {
  const isZip = !!event.target.value.match(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/);
  if (isZip) {
    setZipError('');
    setZip(cleanData(event.target.value));
    // eslint-disable-next-line no-param-reassign
    event.target.value = cleanData(event.target.value);
  } else if (event.target.value === '') {
    setZipError('');
    setZip('');
  } else {
    setZipError('Invalid zip code');
    setZip('');
  }
};

const validatePhone = (
  event: ChangeEvent<HTMLInputElement>,
  setPhone: Dispatch<SetStateAction<number>>,
  setPhoneError: Dispatch<SetStateAction<string>>,
) : void => {
  const isPhone = !!Number(event.target.value)
    .toString()
    .match(/^\d{10}$/);
  if (isPhone) {
    setPhoneError('');
    setPhone(Number(event.target.value));
  } else if (event.target.value === '') {
    setPhoneError('');
    setPhone(0);
  } else if (event.target.value.length !== 10) {
    setPhoneError('Phone number must be 10 digits long');
    setPhone(0);
  } else {
    setPhoneError('Invalid phone number');
    setPhone(0);
  }
};

const validateCard = (
  event: ChangeEvent<HTMLInputElement>,
  setCard: Dispatch<SetStateAction<number>>,
  setCardError: Dispatch<SetStateAction<string>>,
) : void => {
  const isCard = !!event.target.value.match(/^\d{16}$/);
  if (isCard) {
    setCardError('');
    setCard(Number(event.target.value));
  } else if (event.target.value === '') {
    setCardError('');
    setCard(0);
  } else if (event.target.value.length !== 16) {
    setCardError('Card number must be 16 digits long');
    setCard(0);
  } else {
    setCardError('Invalid card number');
    setCard(0);
  }
};

const validateCsc = (
  event: ChangeEvent<HTMLInputElement>,
  setCsc: Dispatch<SetStateAction<number>>,
  setCscError: Dispatch<SetStateAction<string>>,
) : void => {
  const isCvc = !!event.target.value.match(/^\d{3}$/);
  if (isCvc) {
    setCscError('');
    setCsc(Number(event.target.value));
  } else if (event.target.value === '') {
    setCscError('');
    setCsc(0);
  } else if (event.target.value.length !== 3) {
    setCscError('CSC must be 3 digits long');
    setCsc(0);
  } else {
    setCscError('Invalid CSC');
    setCsc(0);
  }
};

const validateExp = (
  event: ChangeEvent<HTMLInputElement>,
  setExp: Dispatch<SetStateAction<string>>,
  setExpError: Dispatch<SetStateAction<string>>,
) : void => {
  const isExp = !!event.target.value.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/);

  if (isExp) {
    const [month, year] = event.target.value.split('/');
    const currentYear = new Date().getFullYear()
      .toString()
      .slice(2);
    const currentMonth = new Date().getMonth() + 1;
    if (Number(year) > Number(currentYear) || (Number(year) === Number(currentYear) && Number(month) >= currentMonth)) {
      setExpError('');
      setExp(cleanData(event.target.value));
      // eslint-disable-next-line no-param-reassign
      event.target.value = cleanData(event.target.value);
    } else {
      setExpError('Card has expired');
      setExp('');
    }
  } else if (event.target.value === '') {
    setExpError('');
    setExp('');
  } else {
    setExpError('Invalid expiration date');
    setExp('');
  }
};

const validateBeforeCheckout = (
  event: FormEvent<HTMLFormElement>,
  address: string,
  setAddressError: Dispatch<SetStateAction<string>>,
  zip: string,
  setZipError: Dispatch<SetStateAction<string>>,
  phone: number,
  setPhoneError: Dispatch<SetStateAction<string>>,
  card: number,
  setCardError: Dispatch<SetStateAction<string>>,
  csc: number,
  setCscError: Dispatch<SetStateAction<string>>,
  exp: string,
  setExpError: Dispatch<SetStateAction<string>>,
): boolean => {
  event.preventDefault();
  let isValidForm = true;
  let addressFocused = false;
  let zipFocused = false;
  let phoneFocused = false;
  let cardFocused = false;
  let cscFocused = false;
  let expFocused = false;
  if (address === '') {
    isValidForm = false;
    const addressField = document.getElementById('address');
    if (addressField instanceof HTMLInputElement) {
      if (addressField.value === '') {
        setAddressError('Address cannot be empty');
      }
    }
    focusAndSetCursorToEnd('address');
    addressFocused = true;
  }
  if (zip === '') {
    isValidForm = false;
    const zipField = document.getElementById('zip');
    if (zipField instanceof HTMLInputElement) {
      if (zipField.value === '') {
        setZipError('Zip code cannot be empty');
      }
    }
    if (!addressFocused) {
      focusAndSetCursorToEnd('zip');
      zipFocused = true;
    }
  }
  if (phone === 0) {
    isValidForm = false;
    const phoneField = document.getElementById('phone');
    if (phoneField instanceof HTMLInputElement) {
      if (phoneField.value === '') {
        setPhoneError('Phone number cannot be empty');
      }
    }
    if (!addressFocused && !zipFocused) {
      focusAndSetCursorToEnd('phone');
      phoneFocused = true;
    }
  }
  if (card === 0) {
    isValidForm = false;
    const cardField = document.getElementById('creditCard');
    if (cardField instanceof HTMLInputElement) {
      if (cardField.value === '') {
        setCardError('Card number cannot be empty');
      }
    }
    if (!addressFocused && !zipFocused && !phoneFocused) {
      focusAndSetCursorToEnd('creditCard');
      cardFocused = true;
    }
  }
  if (csc === 0) {
    isValidForm = false;
    const cscField = document.getElementById('csc');
    if (cscField instanceof HTMLInputElement) {
      if (cscField.value === '') {
        setCscError('CSC cannot be empty');
      }
    }
    if (!addressFocused && !zipFocused && !phoneFocused && !cardFocused) {
      focusAndSetCursorToEnd('csc');
      cscFocused = true;
    }
  }
  if (exp === '') {
    isValidForm = false;
    const expField = document.getElementById('exp');
    if (expField instanceof HTMLInputElement) {
      if (expField.value === '') {
        setExpError('Expiry date cannot be empty');
      }
    }
    if (!addressFocused && !zipFocused && !phoneFocused && !cardFocused && !cscFocused) {
      focusAndSetCursorToEnd('exp');
      expFocused = true;
    }
  }
  return isValidForm;
};

const validateProductName = (
  event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  setProductName: React.Dispatch<React.SetStateAction<string>>,
  setProductNameError: React.Dispatch<React.SetStateAction<string>>,
): void => {
  const is2To50Characters = event.target.value.length >= 2 && event.target.value.length <= 50;
  if (is2To50Characters) {
    setProductNameError('');
    setProductName(cleanData(event.target.value));
    // eslint-disable-next-line no-param-reassign
    event.target.value = cleanData(event.target.value);
  } else if (event.target.value === '') {
    setProductNameError('');
    setProductName('');
  } else {
    setProductNameError('Product name must be 2 to 50 characters long');
    setProductName('');
  }
};

const validatePrice = (
  event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  setPrice: React.Dispatch<React.SetStateAction<number>>,
  setPriceError: React.Dispatch<React.SetStateAction<string>>,
): void => {
  const isPrice = !!event.target.value.match(/^\d+(\.\d{1,2})?$/);
  if (isPrice && Number(event.target.value) <= 1_000_000 && Number(event.target.value) > 0) {
    setPriceError('');
    setPrice(Number(event.target.value));
  } else if (event.target.value === '') {
    setPriceError('');
    setPrice(0);
  } else if (Number(event.target.value) > 1_000_000) {
    setPriceError('Price cannot exceed $1,000,000');
    setPrice(0);
  } else if (Number(event.target.value) <= 0) {
    setPriceError('Price must be greater than $0');
    setPrice(0);
  } else {
    setPriceError('Invalid price');
    setPrice(0);
  }
};

const validateImgUrl = (
  event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  setImageUrl: React.Dispatch<React.SetStateAction<string>>,
  setImageUrlError: React.Dispatch<React.SetStateAction<string>>,
): void => {
  const isValidImageUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      const allowedSchemes = ['http:', 'https:'];
      const imageExtensions = /\.(avif|apng|bmp|gif|ico|jpeg|jpg|png|svg|tiff?|webp|heic)$/i;

      return (
        url.length <= 2000
        && allowedSchemes.includes(parsed.protocol)
        && imageExtensions.test(parsed.pathname)
      );
    } catch {
      return false;
    }
  };

  const sanitizedValue = cleanData(event.target.value);

  if (isValidImageUrl(sanitizedValue)) {
    setImageUrlError('');
    setImageUrl(sanitizedValue);
    // eslint-disable-next-line no-param-reassign
    event.target.value = sanitizedValue;
  } else if (event.target.value === '') {
    setImageUrlError('');
    setImageUrl('');
  } else {
    setImageUrlError('Invalid image URL');
    setImageUrl('');
  }
};

const validateBeforeCreateListing = (
  event: React.FormEvent<HTMLFormElement>,
  productName: string,
  setProductNameError: React.Dispatch<React.SetStateAction<string>>,
  price: number,
  setPriceError: React.Dispatch<React.SetStateAction<string>>,
  imageUrl: string,
  setImageUrlError: React.Dispatch<React.SetStateAction<string>>,
): boolean => {
  event.preventDefault();
  let isValidForm = true;
  let productNameFocused = false;
  let priceFocused = false;
  let imageUrlFocused = false;
  if (productName === '') {
    isValidForm = false;
    const productNameField = document.getElementById('productName');
    if (productNameField instanceof HTMLInputElement) {
      if (productNameField.value === '') {
        setProductNameError('Product name cannot be empty');
      }
    }
    focusAndSetCursorToEnd('productName');
    productNameFocused = true;
  }
  if (price === 0) {
    isValidForm = false;
    const priceField = document.getElementById('price');
    if (priceField instanceof HTMLInputElement) {
      if (priceField.value === '') {
        setPriceError('Price cannot be empty');
      }
    }
    if (!productNameFocused) {
      focusAndSetCursorToEnd('price');
      priceFocused = true;
    }
  }
  if (imageUrl === '') {
    isValidForm = false;
    const imageUrlField = document.getElementById('imageUrl');
    if (imageUrlField instanceof HTMLInputElement) {
      if (imageUrlField.value === '') {
        setImageUrlError('Image URL cannot be empty');
      }
    }
    if (!productNameFocused && !priceFocused) {
      focusAndSetCursorToEnd('imageUrl');
      imageUrlFocused = true;
    }
  }
  return isValidForm;
};

export {
  focusAndSetCursorToEnd,
  validateName,
  validateBeforeSignIn,
  validateBeforeSignUp,
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validateBeforeResetPassword,
  validateOtp,
  validateFeedback,
  validateAddress,
  validateZip,
  validatePhone,
  validateCard,
  validateCsc,
  validateExp,
  validateBeforeCheckout,
  validateProductName,
  validatePrice,
  validateImgUrl,
  validateBeforeCreateListing,
};
