# contributing

Hello developer, please have a quick look at this contributing guide before starting, you probably already know most of what's in here but it's a quick read and explains a few things that are custom to this project:

if you wish to contribute to this project, please first open a [ticket in the github issues page of this project](https://github.com/chrisweb/rehype-github-alerts/issues) and explain briefly what fix or improvement you want to provide (remember the github ticket number you will need it for the commit message later on)

go to the [github page of this project](https://github.com/chrisweb/rehype-github-alerts) and hit the fork button  

clone your fork so that you can edit the code in your local IDE (VSCode):  

`git clone https://github.com/YOUR_GITHUB_USER/rehype-github-alerts.git`

now you can open the project in your IDE (VSCode), happy coding...

when you are done coding, please first run the linting command `npm run lint`

then if there are no linting errors, create a new build using the `npm run build` command

now finally you can commit your local changes to your fork (if your commit is related to a ticket start your commit message with the "#TICKER_NUMBER", this will "link" the commit to the ticket)  

`git commit -m "#TICKER_NUMBER commit message"`

now go to the github page of your fork and hit the pull request button to open a pull request from your fork to this projects github repository
