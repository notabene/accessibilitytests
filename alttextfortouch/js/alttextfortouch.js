function alttextfortouch() {

    var imgs = document.querySelectorAll('img');
    var excludes = ["a","button"]; // list of all parents to be excluded
    var infoBubble = document.createElement("div");
    var infoBubbleText = document.createElement("span");
    infoBubble.appendChild(infoBubbleText);
    var infoBubbleClassname = "alttextfortouchInfobubble";
    // console.log(imgs);

    /* ------------------ HELPER FUNCTIONS -------------- */
    /*
     https://stackoverflow.com/questions/12980877/parents-without-jquery-or-queryselectorall-for-parents#12981248
     Thank you Mark Pieszak https://stackoverflow.com/users/1492009/mark-pieszak-devhelp-online
     */
    function getParents(el, parentSelector /* optional */) {

        // If no parentSelector defined will bubble up all the way to *document*
        if (parentSelector === undefined) {
            parentSelector = document;
        }
    
        var parents = [];
        var p = el.parentNode;
    
        while (p !== parentSelector) {
            var o = p;
            parents.push(o);
            p = o.parentNode;
        }
        parents.push(parentSelector); // Push that parentSelector you wanted to stop at
    
        return parents;
    }

    function styleBubble() {
        var styleStr = "." + infoBubbleClassname + " { position:absolute; z-index:32000 } ";
        styleStr += "." + infoBubbleClassname + " span { position:relative; border:.3em solid black; border-radius:.3em; background:black; color:white; } ";
        styleStr += "." + infoBubbleClassname + "::before { position:absolute; content:''; width:.5em; height:.5em; background:black; bottom:-.3em; left:.5em; transform:rotate(45deg) } ";
        var s = document.createElement("style");
        s.innerText = styleStr;
        document.querySelector("head").appendChild(s);
        infoBubble.className = infoBubbleClassname;
    }
    
    function showBubble(e) {
        // offsetX and offsetY are the pixel where we clicked
        /* var offsetX = e.offsetX; */
        /* var offsetY = e.offsetY; */
        hideBubble(e);
        // console.log(e);
        var callerImg = (e.target);
        var offset = getOffset(callerImg);
        infoBubbleText.innerText = callerImg.getAttribute("alt");
        document.querySelector('body').appendChild(infoBubble);
        // console.log(callerImg.getAttribute("alt"), offset.x, offset.y);
        infoBubble.style.left = (offset.x + parseInt(window.getComputedStyle(callerImg).width, 10)/2 - parseInt(window.getComputedStyle(infoBubble).width, 10)/2 ) + "px";
        infoBubble.style.top = (offset.y - parseInt(window.getComputedStyle(infoBubble).height, 10) ) + "px";
        // console.log('bubble',window.getComputedStyle(infoBubble).top);
        e.stopPropagation();
        document.addEventListener("click",hideBubble);

    }

    function getOffset(elm) {
        var offsetX = 0, offsetY = 0;
            offsetX = elm.offsetLeft;
            offsetY = elm.offsetTop;
        return { x:offsetX, y:offsetY };
    }

    function hideBubble(e) {
        if(infoBubble.parentNode) {
            // console.log(infoBubble);
            infoBubble.parentNode.removeChild(infoBubble);
            document.removeEventListener("click",hideBubble);

        } else {
            // console.log("not found",e);
        }
    }
    
    /* ------------------ END HELPER FUNCTIONS -------------- */
    
    /* 1. style the bubble */
    styleBubble();
    
    /* 2. find all images, add behaviour on them */
    for(var i=0 ; i < imgs.length ; i++) { // foreach does not work with IE11 on dom node list
        var isExcluded = false;
        var parents = getParents(imgs[i]);
        parents.forEach( function (element) {
             if (excludes.indexOf(element.nodeName.toLowerCase()) !== -1) {
                // console.log(imgs[i], "TO EXCLUDE");
                isExcluded = true;
            }
        });
        if(!isExcluded) {
            imgs[i].addEventListener("click",showBubble);
        }
    }

}

window.addEventListener("load",alttextfortouch);