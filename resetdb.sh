#!/bin/bash
#mongodb 进入client 并use admin
MongoDB='mongo -u admin -p 111111 --authenticationDatabase=admin'

$MongoDB <<EOF
use explorerDB
db.dropDatabase()
exit;
EOF
exit 0

MongoDB='mongo -u admin -p 111111 --authenticationDatabase=admin'

$MongoDB <<EOF
use explorerDB
db.createUser( { user: "explorer", pwd: "11111", roles: ["dbOwner"] } )
exit;
EOF
