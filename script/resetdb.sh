#!/bin/bash
#mongodb 进入client 并use admin
MongoDB='mongo amdin' # -u admin -p Xlife.toP201956125001 --authenticationDatabase=admin'

$MongoDB <<EOF
use explorerDB
db.dropDatabase()
exit;
EOF
exit 0

MongoDB='mongo -u admin -p Xlife.toP201956125001 --authenticationDatabase=admin'

$MongoDB <<EOF
use explorerDB
db.createUser( { user: "explorer", pwd: "Xlife.toP201956125001", roles: ["dbOwner"] } )
exit;
EOF
