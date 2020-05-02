const formatDuration = require('./FormatDuration.js');

module.exports = function playbackBar(message, video) {
  const passedTimeInMS = message.guild.musicData.songDispatcher.streamTime;
  const passedTimeInMSObj = {
    seconds: Math.floor((passedTimeInMS / 1000) % 60),
    minutes: Math.floor((passedTimeInMS / (1000 * 60)) % 60),
    hours: Math.floor((passedTimeInMS / (1000 * 60 * 60)) % 24),
  };
  const passedTimeFormatted = formatDuration(passedTimeInMSObj);

  const totalDurationObj = video.rawDuration;
  const totalDurationFormatted = formatDuration(totalDurationObj);

  let totalDurationInMS = 0;
  Object.keys(totalDurationObj).forEach(function (key) {
    if (key == 'hours') {
      totalDurationInMS = totalDurationInMS + totalDurationObj[key] * 3600000;
    } else if (key == 'minutes') {
      totalDurationInMS = totalDurationInMS + totalDurationObj[key] * 60000;
    } else if (key == 'seconds') {
      totalDurationInMS = totalDurationInMS + totalDurationObj[key] * 100;
    }
  });
  const playBackBarLocation = Math.round(
    (passedTimeInMS / totalDurationInMS) * 10
  );
  let playBack = '';
  for (let i = 1; i < 21; i++) {
    if (playBackBarLocation == 0) {
      playBack = '●———————————————————';
      break;
    } else if (i === playBackBarLocation * 2) {
      playBack += '●';
    } else {
      playBack += '—';
    }
  }
  playBack = `${passedTimeFormatted} | ${totalDurationFormatted}\n${playBack}`;
  return playBack;
};
