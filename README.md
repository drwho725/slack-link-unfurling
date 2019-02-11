# slack-link-unfurling
Guide on how to implement link unfurling in slack


## Getting Started
These instructions will guide you on controlling unfurling of links tied to your domain(s).


### Prerequisites
You'll need the following tools to setup your environment:

* [Node.js](https://nodejs.org/en/)
* [Ngrok](https://ngrok.com/)
* [Slack](https://slack.com/)


### Setting up back-end
1. Clone the repo
2. Run `npm install` to install all the packages
3. Run `npm run-script run` to start up the node app
4. In a separate command console run `./ngrok http 1337`


### Setting up Slack App
1. Go to [Step 1 - Your Apps](https://api.slack.com/apps) page
2. Click on **Create New App**  
    ![Step 2 - Create New App](https://i.imgur.com/g29aFVd.png)
3. Set the **App Name** and select the workspace to Develop the app  
    ![Step 3 - Set App Name and workspace](https://i.imgur.com/xPIuIdS.png)
4. Copy the **Client ID**, **Client Secret** and **Signing Secret** values to _config.json_ file  
    ![Step 4 - Copy over credentials](https://i.imgur.com/jvMjlH3.png)
5. Click on **Event Subscriptions**  
    ![Step 5 - Event Subscriptions](https://i.imgur.com/1bjp95d.png)
6. Enable Events  
    ![Step 6 - Enable events](https://i.imgur.com/w2IYkRG.png)
    ![Events enabled](https://i.imgur.com/XPXqsTC.png)
7. Set the **Request URL** to be ngrok's session url  
    ![Step 7 - Events Request URL](https://i.imgur.com/KJ3Uvc5.png)
    * You should see a ping from Slack verifying the endpoint and once that is done, you should see *Verified* above the Request URL field
    ![Ngrok session](https://i.imgur.com/5kuhhWK.png)
8. Subscribe to Link Shared event  
    ![Step 8 - Subscribe to Link Shared event](https://i.imgur.com/NEjdAUz.png)
    ![link_shared event](https://i.imgur.com/C6dOqAH.png)
9. Add the [domains](https://api.slack.com/docs/message-link-unfurling#registering_your_domain_names) you want to be notified of when shared  
    ![Step 9 - Add domains to monitor](https://i.imgur.com/UOiBoZE.png)
10. Save the changes to Event Subscriptions, it should look like this:  
    ![Step 10 - Save Event Subscriptions](https://i.imgur.com/dS0w3Cc.png)
11. Click on **Bot Users** - Need this for the botkit library we are using to interface with Slack  
    ![Step 11 - Setup Bot Users](https://i.imgur.com/B2HUpRZ.png)
12. Fill out the bot user info  
    ![Step 12 - Fill out bot user info](https://i.imgur.com/EQHhwC6.png)
13. Click on **OAuth & Permissions** to set up the _Scopes_ and get _Tokens_  
    ![Step 13 - Scopes and Tokens](https://i.imgur.com/wSUgt59.png)
14. Add the following to **Permission Scopes**:  
    * links:write
    * team:read
    ![Step 14 - Scope update](https://i.imgur.com/0WhAcdB.png)
15. Click on **Install App to Workspace** to add the App to your workspace  
    ![Step 15 - Add app to workspace](https://i.imgur.com/7lV1JrI.png)
16. Verify the permissions request by the app and authorize the app  
    ![Step 16 - Verify and Authorize app](https://i.imgur.com/u4e8W8V.png)
17. Copy the **OAuth Access Token** and **Bot User OAuth Access Token** to the _config.json_ file  
    ![Step 17 - Copy over tokens](https://i.imgur.com/dLC5Mn2.png)
18. From your Slack channel (any!) type in http://example.com and see it unfurl!  
    ![Step 18 - Test unfurl a single link](https://i.imgur.com/6Y1SGs5.png)
    * Incoming request from Slack  
        ![Request from Slack](https://i.imgur.com/SEGDP65.png)
    * Outgoing response to Slack  
        ![Response to Slack](https://i.imgur.com/nD2vJ4R.png)
19. Now try passing http://example.com https://example.com  
    ![Step 19 - Test unfurling 2 links](https://i.imgur.com/flmbN6p.png)
    * Slack sends back both urls in the links array
    * Incoming request from Slack  
        ![Incoming request from Slack](https://i.imgur.com/WwSrcnx.png)


### Future proofing link unfurling
Currently in LinkSharedHandler.js the following block of code explicitly handles cases of one and two urls:  
```js
const unfurls = {};

unfurls[message.event.links[0].url] = {
    'text': 'testing 1',
};

if (message.event.links.length > 1) {
    unfurls[message.event.links[1].url] = {
        'title': 'testing 2',
        'title_link': 'https://example.com',
        'text': 'testing 2',
        'fields': [
            {
                'title': 'Testing 2',
                'value': 10,
                'short': true
            }
        ],
        'actions': [
            {
                'name': 'Testing',
                'text': 'Testing 2',
                'type': 'button',
                'value': 'testing'
            }
        ]
    };
}
```
This is done purely to demonstrate sending back of simple text message for the first link and an interactive message for the second link if one is passed.  
More often than not you'll have same format for urls matching specific domains so processing of the links can be done via map function.  


### Reading Resources
* [Slack link unfurling](https://api.slack.com/docs/message-link-unfurling)
* [Botkit](https://botkit.ai/docs/readme-slack.html)
* [PM2](https://pm2.io/doc/en/runtime/overview/)


### TODO
Need to add testing! I have tried out [botkit-mock](https://github.com/gratifyguy/botkit-mock) but was unable to figure out how to set up track events :\  


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
