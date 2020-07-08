DIR=$HOME/$REPL_SLUG
PATH=$PATH:$DIR/jre:$DIR/jre/bin
java -Xmx1G -Xms1G -jar server.jar nogui | node .