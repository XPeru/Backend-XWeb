#!/bin/bash

for jsFile in z_*.js
do
    timeout --signal=SIGINT 15 node $jsFile;
    if [ $? != 0 ];
    then
	break;
    fi
done