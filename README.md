# Concept
##### This rest allows you to quickly set up a discord bot with an event and command handler as well as quickly usable libs

# Usage
- ##### Installation
		git clone https://github.com/M1O0O/template-discord.js-bot.git
		cd template-discord.js-bot
		npm i

- ##### Start
		node .

- ##### Start using pm2
		npm i pm2 -g
		pm2 start src/main.js --name TemplateDiscordBot

# Commands pm2
- ##### List
		pm2 l

- ##### Start
		pm2 start [ID or NAME]

- ##### Stop
		pm2 stop [ID or NAME]

- #####  AutoStart
		pm2 startup [ID or NAME]

- ##### Save settings
		pm2 save