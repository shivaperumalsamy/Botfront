#!/bin/bash

# Get Version Number
read -p 'Enter the Release Version #:' version
echo Provided Release version: $version
echo Pulling dev-latest docker image
docker pull test-slc-nexus-nxrm01.utahcourts.local/botfront:dev-latest

echo Tagging dev-latest into uat release $version

docker tag test-slc-nexus-nxrm01.utahcourts.local/botfront:dev-latest test-slc-nexus-nxrm01.utahcourts.local/botfront:uat-$version

echo Tagging dev-latest into prod release $version

docker tag test-slc-nexus-nxrm01.utahcourts.local/botfront:dev-latest test-slc-nexus-nxrm01.utahcourts.local/botfront:prod-$version

echo Pushing the containers

docker push test-slc-nexus-nxrm01.utahcourts.local/botfront:uat-$version

docker push test-slc-nexus-nxrm01.utahcourts.local/botfront:prod-$version

echo Success

docker rmi test-slc-nexus-nxrm01.utahcourts.local/botfront:dev-latest -f

docker rmi test-slc-nexus-nxrm01.utahcourts.local/botfront:uat-$version -f 

docker rmi test-slc-nexus-nxrm01.utahcourts.local/botfront:prod-$version -f 