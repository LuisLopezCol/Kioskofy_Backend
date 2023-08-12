/**
 * check if email is valid or not
 * @param {*} email | email
 * @returns Boolean
 */
const validateEmail = (email) => {
    if (!email) return false

    const validateEmail = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(email);
    return validateEmail;
}

/**
   * Check validations on current password type string
   * => 8 Characters
   * => Has uppercase
   * => Has number
   * @param password | Password to check in string
   * @return true => Password valid | false => password invalid
   */
const onCheckPassword = (password) => {
    if (!password) return false
    const hasUpperCase = /[A-Z]+/.test(password);
    const hasNumber = /[0-9]+/.test(password);
    const characters = password.length >= 8 ? true : false;
    return hasNumber && characters && hasUpperCase;
  }

module.exports = {
    validateEmail,
    onCheckPassword
}