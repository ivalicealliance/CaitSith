# CaitSith
A greeter bot for Discord

## Prerequisites
- Node.js >= 22.12.0
- PM2 (Process Manager)

## Environment Variables
Create a `.env` file in the root directory with the following variables:
```
CS_DISCORD_TOKEN="your_discord_bot_token"
CS_WELCOME_MESSAGE_URL="https://example.com/welcome-template.txt" # Optional
```

## Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the bot:
   ```bash
   npm start
   ```

## Production Deployment (Google Cloud / VPS)
To keep the bot running 24/7 and automatically restart on server reboots, use **PM2** instead of a custom startup script.

1. Install PM2 globally (if not already installed):
   ```bash
   npm install pm2 -g
   ```

2. Start the bot directly via PM2:
   ```bash
   pm2 start index.mjs --name "CaitSith"
   ```

3. Configure PM2 to start on server boot:
   ```bash
   pm2 startup
   # Copy and paste the command PM2 outputs to your terminal
   ```

4. Save the current PM2 list:
   ```bash
   pm2 save
   ```

**Note:** You do not need to add anything to the Google Cloud "Startup Script" field. PM2 handles the boot sequence natively through SystemD.
