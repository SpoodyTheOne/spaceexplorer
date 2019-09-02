function readXml(xmlFile) {

    var xmlDoc;

    if (typeof window.DOMParser != "undefined") {
        xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", xmlFile, false);
        if (xmlhttp.overrideMimeType) {
            xmlhttp.overrideMimeType('text/xml');
        }
        xmlhttp.send();
        xmlDoc = xmlhttp.responseXML;
    } else {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.load(xmlFile);
    }
    var tagObj = xmlDoc.getElementsByTagName("marker");
    var typeValue = tagObj[0].getElementsByTagName("type")[0].childNodes[0].nodeValue;
    var titleValue = tagObj[0].getElementsByTagName("title")[0].childNodes[0].nodeValue;
}