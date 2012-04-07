// import QtQuick 1.0 // to target S60 5th Edition or Maemo 5
import QtQuick 1.1
import QtWebKit 1.0

Rectangle {
    width: 360
    height: 360
    WebView {
        anchors.fill: parent
        url: "../../client/client/index.html"
        onLoadFinished: {
            console.log("Loaded!")
        }
        onLoadFailed: {
            console.log("Error!")
        }
    }
}
