docker-compose pull

docker tag test-slc-nexus-nxrm01.utahcourts.local/botfront:dev-latest test-slc-nexus-nxrm01.utahcourts.local/botfront:dev-stable
docker push test-slc-nexus-nxrm01.utahcourts.local/botfront:dev-stable

docker rmi test-slc-nexus-nxrm01.utahcourts.local/botfront:dev-latest

npm ci
npm run build

docker-compose build
docker-compose push