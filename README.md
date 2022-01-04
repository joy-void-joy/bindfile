Bindfiles
===
Host your files as editable html pages

When using [trilium-notes], I found myself wanting a quick way to edit files on my server remotely without having to ssh into it
This is a very simple implementation for that, the files are hosted under ./userfiles, and the webpage allow you to edit it

As opposed to google doc or framapad, it's very lightweight and has a one-to-one correspondance with the files
(TODO: Explain this better + screenshots)

Usage
---
Run ```npm run dev```
Then head to / to see the list of your files. You may create a new one by visiting /[name]

Notes
---
Note that there is no protection of your api, so anyone with the link can also edit it. If you wish to protect it, run your server under a reverse proxy, and add a basicauth to it.
I personally use Caddy for that, which works great (TODO: Expand on that)

Also note that this is sort of unstable at the moment. There is no possibility of coedition right now (last change overwrites the file) and no automatic synchronization. See the todolist for more informaiton

Todo-list
---
- [ ] Retry to save if fetch did not work
- [ ] Notify the user if quitting but last fetch did not work (+ loading wheel)
- [ ] Warn the user if modifying on an old copy
- [ ] Automatic backups of file versions
