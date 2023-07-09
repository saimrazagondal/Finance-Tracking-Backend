const numbers = '0123456789';

module.exports = (digits = 6) => {
  let OTP = ``;

  Array.from(Array(digits).keys()).forEach((i) => {
    OTP += numbers[Math.floor(Math.random() * 10)];
  });

  return OTP;
};
