const formatDuration = require('./FormatDuration.js');

module.exports = (message, video) => {
  const passedTimeMS = message.guild.musicData.songDispatcher.streamTime;
  const passedTime = formatDuration({
    seconds: Math.floor((passedTimeMS / 1000) % 60),
    minutes: Math.floor((passedTimeMS / 60000) % 60),
    hours: Math.floor((passedTimeMS / 3600000) % 24),
  });

  const totalDurationObj = video.rawDuration;
  const totalDuration = formatDuration(totalDurationObj);

  let totalTimeMS = 0;
  Object.keys(totalDurationObj).forEach((key) => {
    if (key === 'hours') {
      totalTimeMS += totalDurationObj[key] * 3600000;
    } else if (key === 'minutes') {
      totalTimeMS += totalDurationObj[key] * 60000;
    } else if (key === 'seconds') {
      totalTimeMS += totalDurationObj[key] * 100;
    }
  });
  const playBackBarLocation = Math.round((passedTimeMS / totalTimeMS) * 10);
  let playBack = '';
  for (let i = 0; i <= 20; i++) {
    if (i === playBackBarLocation * 2) {
      playBack += '●';
    } else {
      playBack += '—';
    }
  }
  playBack = `${passedTime} | ${totalDuration}\n${playBack}`;
  return playBack;
};
