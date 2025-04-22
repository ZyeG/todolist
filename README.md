Exercise (Angular, docker, deployment, CI/CD)

source code from https://docs.docker.com/get-started/introduction/build-and-push-first-image/ 


### rewrite react frontend in angular
### updated dockerfile and compose
- bundled frontned and backend, frontend served as static by node
- compose by: `docker compose up --build`, http://localhost:3000 (app),  http://localhost:8080 (db admin)
### publish image to dockerhub
- `docker build -t <DOCKER_USERNAME>/<IMAGE_NAME> .` `docker buildx build --platform linux/amd64 -t  <DOCKER_USERNAME>/<IMAGE_NAME>.`
- `docker push <DOCKER_USERNAME>/<IMAGE_NAME>`
- gzyjoy:todolist
### deploy to railway
- add service todolist with plugin MySQL
- deployed at `https://todolist-production-2f40.up.railway.app/`
