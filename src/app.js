import tmi from 'tmi.js';
import {
  BOT_USERNAME,
  OAUTH_TOKEN,
  CHANNEL_NAMES,
  MODS,
  TARGET_CHANNELS,
} from './constants';

const options = {
  options: { debug: true },
  connection: {
    reconnect: true,
    secure: true,
  },
  identity: {
    username: BOT_USERNAME,
    password: OAUTH_TOKEN,
  },
  channels: CHANNEL_NAMES,
};

const fs = require('fs');

const client = new tmi.Client(options);

client.connect().catch(console.error);

client.on('message', (channel, userstate, message, self) => {
  if (self) return;

  //let mod = MODS.some((mod) => userstate.username.toLowerCase().includes(mod));
  let isMod = userstate.mod || userstate['user-type'] === 'mod';
  let isBroadcaster = channel.slice(1) === userstate.username;
  let mod = isMod || isBroadcaster;

  // Hello Message
  if (message.toLowerCase() === '!alena' && mod) {
    client.say(
      channel,
      `/me Alena_Bot: Ready in the following channels: ${TARGET_CHANNELS}`
    );
  }

  //------------------------------------------------------------------------------------------

  if (message.toLowerCase().startsWith('!allban') && mod) {
    let input = message.split(' ');
    if (input.length < 2) {
      return;
    } else {
      for (let target = 0; target < TARGET_CHANNELS.length; target++) {
        console.log(TARGET_CHANNELS[target], input[1], userstate.username);
        client.ban(
          TARGET_CHANNELS[target],
          input[1],
          `Alena_Bot ban performed by ${userstate.username}`
        );
      }
      fs.appendFile('bans.txt', `${input[1]},\n`, 'utf8', function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
    }
  }

  //------------------------------------------------------------------------------------------

  if (message.toLowerCase().startsWith('!allunban') && mod) {
    let input = message.split(' ');
    if (input.length < 2) {
      return;
    } else {
      for (let target = 0; target < TARGET_CHANNELS.length; target++) {
        console.log(TARGET_CHANNELS[target], input[1], userstate.username);
        client.say(TARGET_CHANNELS[target], `/unban ${input[1]}`);
      }
      fs.appendFile('bans.txt', `${input[1]} UNBANNED,\n`, 'utf8', function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
    }
  }

  //------------------------------------------------------------------------------------------

  if (userstate.username === BOT_USERNAME) return;

  //checkTwitchChat(userstate, message, channel);
});
