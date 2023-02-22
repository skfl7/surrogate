import { RegexValidation } from '../Regex';

type inputProps = {
  textId: string;
  value?: any;
  checkEmptyValue?: boolean;
};
export const validateInputFields = ({
  textId,
  value,
  checkEmptyValue = false,
}: inputProps) => {
  let result = {
    showError: false,
    message: '',
  };

  const inputValue = value ? value : '';

  if (inputValue !== '' || checkEmptyValue) {
    // phone number validation
    if (textId === 'tellNumber' || textId === 'mobileNumber') {
      const error = !RegexValidation.MobilePattern.test(inputValue);
      result.showError = error;
      result.message = error ? `Please enter valid ${textId}` : '';
      return result;
    }
    //email validation
    if (textId === 'email') {
      const error = !RegexValidation.EmailPattern.test(inputValue);
      result.showError = error;
      result.message = error ? 'Please enter valid mailId' : '';
      return result;
    }
    //bank Account number
    if (textId === 'bankAccountNumber') {
      const error = !RegexValidation.bankAccountNumber.test(inputValue);
      result.showError = error;
      result.message = error ? `Please enter valid ${textId}` : '';
      return result;
    }
    //IFCS code
    if (textId === 'ifscCode') {
      const error = !RegexValidation.ifscCode.test(inputValue);
      result.showError = error;
      result.message = error ? 'Please enter valid IFSC code' : '';
      return result;
    }
    //Pincode code
    if (textId === 'pincode') {
      const error = !RegexValidation.pincode.test(inputValue);
      result.showError = error;
      result.message = error ? `Please enter valid ${textId}` : '';
      return result;
    }
    //MICRCODE
    if (textId === 'micrCode') {
      const error = !RegexValidation.micrCodeValidate.test(inputValue);
      result.showError = error;
      result.message = error ? `Please enter valid ${textId}` : '';
      return result;
    }

    //only captial letter and number
    if (
      textId === 'tinNumber' ||
      textId === 'shopNumber' ||
      textId === 'esicNumber' ||
      textId === 'pfRegisterNumber'
    ) {
      const error = RegexValidation.capLetterNumber.test(inputValue);
      result.showError = error;
      result.message = error ? `Please enter valid ${textId}` : '';
      return result;
    }
    //gst validation
    if (textId === 'gstNumber') {
      const error = !RegexValidation.gstNumber.test(inputValue);
      result.showError = error;
      result.message = error ? 'Please enter valid GST Number' : '';
      return result;
    }
    //pan validation
    if (textId === 'panNumber') {
      const error = !RegexValidation.panNumberValidate.test(
        inputValue.toUpperCase()
      );
      result.showError = error;
      result.message = error ? `Please enter valid ${textId}` : '';
      return result;
    }
    // only number
    if (textId === 'maxCardLimit' || textId === 'cibilScore') {
      const error = !RegexValidation.onlyNumber.test(inputValue);
      result.showError = error;
      result.message = error ? `Please enter valid ${textId}` : '';
      return result;
    }
    if (textId === 'defaultCreditPeriod') {
      const error =
        !RegexValidation.validatedefaultCreditPeriod.test(inputValue);
      result.showError = error;
      result.message = error ? `Please enter valid ${textId}` : '';
      return result;
    }
    //empty field
    if (textId === 'roleName') {
      const error =
        !RegexValidation.onlycharectorNumberAndSpace.test(inputValue);
      result.showError = error;
      result.message = error ? 'Please fill valid roleName' : '';
      return result;
    }

    // only character validation
    if (textId === 'operatingCity' || textId === 'serviceDescription') {
      const error = !RegexValidation.onlycharacter.test(inputValue);
      result.showError = error;

      result.message = error ? `Please enter valid ${textId}` : '';
      return result;
    }
    // only character validation
    if (
      textId === 'supplierName' ||
      textId === 'name' ||
      textId === 'employeeName' ||
      textId === 'cardName' ||
      textId === 'designation'
    ) {
      const error = !RegexValidation.onlycharacterAndDot.test(inputValue);
      result.showError = error;
      result.message = error ? `Please enter valid ${textId}` : '';
      return result;
    }
    if (textId === 'employeeName') {
      const error = !RegexValidation.nameValidation.test(inputValue);
      result.showError = error;
      result.message = error ? `Please enter valid ${textId}` : '';
      return result;
    }

    //only character and number validation
    if (
      textId === 'bussinessId' ||
      textId === 'registerNumber' ||
      textId === 'companyRegistrationNo' ||
      textId === 'majorProducts' ||
      textId === 'payeeDetails' ||
      textId === 'employeeId'
    ) {
      const error = RegexValidation.characterNumber.test(inputValue);
      result.showError = error;
      if (inputValue === '') {
        result.message = error ? 'Please fill this field' : '';
      } else {
        result.message = error ? `Please enter valid ${textId}` : '';
      }
      return result;
    }
    return result;
  }

  return result;
};
