export const RegexValidation = {
  NamePattern: /^([^\d\W_]|[]){3,50}$/,
  EmailPattern:
    /^([a-zA-Z0-9_\-\.!#$%&'*+/=?^]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,10})$|^(?:\d{10}|\w+@\w+\.\w{2,3})$/,
  MobilePattern: /^[1-9]{1}[0-9]{9}$/,
  PanPattern: /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,
  passwordPattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
  loginPasswordPattern:
    /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*?[0-9])(?=.*?\W).*$/,
  characterNumber: /[^A-Za-z0-9]+/,
  characterNumberspace: /[^A-Za-z 0-9]+/,
  onlycharacter: /^[A-z ]+$/,
  onlycharacterAndDot: /^[A-z .]+$/,
  bankAccountNumber: /^\d{9,18}$/,
  ifscCode: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  pincode: /^[0-9]{6}$/,
  validatedefaultCreditPeriod: /^[0-9]{2}$/,
  micrCodeValidate: /^[0-9]{9}$/,
  capLetterNumber: /[^A-Z0-9]+/,
  gstNumber: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  panNumberValidate: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  onlyNumber: /^[0-9]+$/,
  onlycharectorNumberAndSpace: /^[A-z 0-9]+$/,
  numberValidation: /^[0-9]$/,
  nameValidation :/^[a-zA-Z ]+$/
};
