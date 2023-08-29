# Bindfiles

Host your files as editable html pages

![](https://github.com/joy-void-joy/bindfiles/blob/main/assets/demo_bindfile.gif)

This project allows you to host an online barebone file editor to edit files on your server directly (Files contained within the folder ./userfiles)  
I have found this to be very useful to directly modify unimportant config files, RSS feeds (see https://github.com/joy-void-joy/tacocast ), and quick todos

## Usage

`yarn`  
`yarn dev`

Then head to / to see the list of your files. You may create a new one by visiting /[name] or even /[subfolder]/[subfolder]/.../[name]

This can also be deployed with node:

`yarn build`
`yarn start`

Modify the port with the PORT environment variable (default: 1234)

## Features

- File and folder creation through pathing
- Synchronize the content with all instances at once (merging using TipTap)
- Automatic retries

## Notes

- The sync uses TipTap and Yjs, allowing multiple modifications to be merged seamlessly.
- There is no API protection, anyone with the link can also edit it. If you wish to protect it, run your server under a reverse proxy, and add a basicauth to it or something more robust. With caddy, if you are running bindfiles on the 3000 port you can do:

```caddy
...
  reverse_proxy 127.0.0.1:3000
  basicauth {
    [fill username here] [put your hashed password with caddy hash-password here]
  }
```

- Concurrent edition is now supported

## Todo-list

- [ ] Test suite
- [ ] Automatic backups of file versions
