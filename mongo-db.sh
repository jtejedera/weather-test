#!/bin/bash
mongo -u root -p example --eval 'db.createUser({user: "nodeuser",pwd: "example",roles:[{role: "readWrite" , db:"test"}]});'