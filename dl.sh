echo By executing this script you agree to the JRE License, the PaperMC license,
echo the Mikeylab License, the Mojang Minecraft EULA,
echo the NPM license, the MIT license,
echo and the licenses of all packages used \in this project.
echo Press Ctrl+C \if you \do not agree to any of these licenses.
echo Press Enter to agree.
read -s agree_text &&
echo Thank you \for agreeing, the download will now begin.
wget -O jre.tar.gz "https://javadl.oracle.com/webapps/download/AutoDL?BundleId=242050_3d5a2bb8f8d4428bbe94aed7ec7ae784" &&
tar -zxf jre.tar.gz &&
rm -rf jre.tar.gz &&
mv ./jre* ./jre &&
echo JRE downloaded &&
wget -O server.jar "https://papermc.io/api/v1/paper/1.16.1/latest/download" &&
echo Paper downloaded &&
wget -O server.properties "https://files.mikeylab.com/xpire/server.properties" &&
echo Server properties downloaded &&
echo "eula=true" > eula.txt &&
echo Agreed to Mojang EULA &&
npm i &&
echo Installed NPM packages &&
rm -rf ./dl.sh &&
echo Download script removed
echo
echo
echo
echo Download \complete