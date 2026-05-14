import dotenv from 'dotenv';
import pkg from 'discord.js';

dotenv.config();

if (!process.env.CS_DISCORD_TOKEN) {
  console.error('Missing CS_DISCORD_TOKEN in environment variables.');
  process.exit(1);
}

if (!process.env.CS_WELCOME_MESSAGE_URL) {
  console.warn('Missing CS_WELCOME_MESSAGE_URL. Will use default fallback message.');
}

const { Client, GatewayIntentBits } = pkg;
const client = new Client({ intents: [pkg.GatewayIntentBits.Guilds, pkg.GatewayIntentBits.GuildMembers] });

client.once('clientReady', () => {
  console.log('Bot is ready!');
});

async function fetchWelcomeMessage() {
  if (!process.env.CS_WELCOME_MESSAGE_URL) {
    return 'Welcome to the server, {member}!';
  }
  
  try {
    const response = await fetch(process.env.CS_WELCOME_MESSAGE_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    return text.trim();
  } catch (error) {
    console.error('Error fetching the welcome message:', error);
    return 'Welcome to the server, {member}!'; // Fallback message
  }
}

client.on('guildMemberAdd', async (member) => {
  const welcomeMessageTemplate = await fetchWelcomeMessage();
  
  if (!welcomeMessageTemplate) return;

  const welcomeMessage = welcomeMessageTemplate
    .replaceAll('{member}', member.toString())
    .replaceAll('{username}', client.user.username)
    .replaceAll('{server_name}', member.guild.name);

  const systemChannel = member.guild.systemChannel;
  if (systemChannel) {
    systemChannel.send(welcomeMessage).catch(console.error);
  } else {
    console.log(`System channel not found for guild: ${member.guild.name}`);
  }
});

client.on('error', (error) => {
  console.error('Discord client error:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

client.login(process.env.CS_DISCORD_TOKEN);
