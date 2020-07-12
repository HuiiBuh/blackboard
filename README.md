# Blackboard

![Docker Continuous Integration](https://github.com/HuiiBuh/blackboard/workflows/Docker%20Continuous%20Integration/badge.svg)

Server and client which together let you edit blackboards in markdown.

**This was a project for university. Is not intended to be used in production. There are XSS vulnerabilities and a bunch of other security related issues!**


## Preview

All blackboad overview
![Preview](https://i.imgur.com/jaNTRdF.png)

One blackboard markdown preview
![Blackboad](https://i.imgur.com/IWC66mn.png)

## Run the server

This will automatically serve the html and static files.

The **static** files are at `localhost:8000/static/*`  
The **api** is at `localhost:8000/api/*`  
The **index.html** is at `localhost:8000/*` except at `/static` and `/api`

### Locally

- Install the _requirements.txt_
- run the script _stc/start.py_

### Docker

+ Go into the folder **docker**  
+ Run **build.sh**
+ Execute `docker-compose up`
+ Get the ip of the container with `docker inspect blackboard_reverse_proxy --format='{{.NetworkSettings.Networks.docker_default.IPAddress}}'`
+ Visit the ip address in the browser

## Credits

- Favicon from [Freeicons](https://freeicons.io/essential-web-4/blackboard-data-summary-annual-report-icon-40372)
- The github markdown css which makes the markdown preview look nicer by [sindresorhus](https://github.com/sindresorhus/github-markdown-css)
