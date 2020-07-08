wget -O jre.tar.gz "https://javadl.oracle.com/webapps/download/AutoDL?BundleId=242050_3d5a2bb8f8d4428bbe94aed7ec7ae784" &&
tar -zxf jre.tar.gz &&
rm -rf jre.tar.gz &&
mv ./jre* ./jre &&
echo JRE downloaded &&
wget -O server.jar "https://papermc.io/api/v1/paper/1.16.1/latest/download" &&
echo Paper downloaded