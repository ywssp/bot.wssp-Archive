module.exports = ({ hours, minutes, seconds }) => {
  const duration = `${hours ? `${hours}:` : ''}${minutes || '00'}:${
    seconds < 10 ? `0${seconds}` : seconds || '00'
    }`;
  return duration;
};
