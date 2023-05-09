import dotenv from 'dotenv';
import pkg from 'discord.js';
import fetch from 'node-fetch';

dotenv.config();

const { Client, GatewayIntentBits } = pkg;
const client = new Client({ intents: [pkg.GatewayIntentBits.Guilds, pkg.GatewayIntentBits.GuildMembers] });

client.once('ready', () => {
  console.log('Bot is ready!');
});

async function fetchWelcomeMessage() {
  try {
    const response = await fetch(process.env.WELCOME_MESSAGE_URL);
    const text = await response.text();
    return text;
  } catch (error) {
    console.error('Error fetching the welcome message:', error);
    return '';
  }
}

client.on('guildMemberAdd', async (member) => {
  const welcomeMessageTemplate = await fetchWelcomeMessage();
  const welcomeMessage = welcomeMessageTemplate
    .replace('{member}', member.toString())
    .replace('{username}', client.user.username)
    .replace('{server_name}', member.guild.name);

  const systemChannel = member.guild.systemChannel;
  if (systemChannel) {
    systemChannel.send(welcomeMessage);
  } else {
    console.log('System channel not found');
  }
});

client.login(process.env.DISCORD_TOKEN);
