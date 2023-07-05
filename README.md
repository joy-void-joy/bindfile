Bindfiles
===
Host your files as editable html pages

![](https://github.com/joy-void-joy/bindfiles/blob/main/assets/demo_bindfile.gif)

This project allows you to host an online barebone file editor to edit files on your server directly (Files contained within the folder ./userfiles)  
I have found this to be very useful to directly modify unimportant config files, RSS feeds (see https://github.com/joy-void-joy/tacocast ), and quick todos

Usage
---
Run ```yarn dev```
Then head to / to see the list of your files. You may create a new one by visiting /[name]

This can also be deployed with node

Features
---
- File and folder creation through pathing
- Synchronize the content with all instances at once
- Automatic retries

Notes
---
- The sync is very basic, it just copies the whole file content at once
- There is no API protection, anyone with the link can also edit it. If you wish to protect it, run your server under a reverse proxy, and add a basicauth to it or something more robust. With caddy, if you are running bindfiles on the 3000 port you can do:
```caddy
...
  reverse_proxy 127.0.0.1:3000
  basicauth {
    [fill username here] [put your hashed password with caddy hash-password here]
  }
```
- Concurrent edition is not supported. If you do, you will overwrite each other due to synchronisation.

Todo-list
---
- [ ] Test suite
- [ ] Automatic backups of file versions
