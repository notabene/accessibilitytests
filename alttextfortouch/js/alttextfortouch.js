function alttextfortouch() {

    var excludes = ["a","button"]; // list of all parents to be excluded
    var infoBubble = document.createElement("div");
    var infoBubbleText = document.createElement("span");
    infoBubble.appendChild(infoBubbleText);
    var infoBubbleClassname = "alttextfortouchInfobubble";

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

    /**
     * Create style for infobubble
     */
    function styleBubble() {
        var styleStr = "." + infoBubbleClassname + " { position:absolute; z-index:32000 } ";
        styleStr += "." + infoBubbleClassname + " span { position:relative; border:.3em solid black; border-radius:.3em; background:black; color:white; } ";
        styleStr += "." + infoBubbleClassname + "::before { position:absolute; content:''; width:.9em; height:.9em; background:black; bottom:-.4em; left:.5em; transform:rotate(45deg) } ";
        var s = document.createElement("style");
        s.innerText = styleStr;
        document.querySelector("head").appendChild(s);
        infoBubble.className = infoBubbleClassname;
    }

    /**
     * If any image has a data attribute to say it's showing an infobubble, get rid of it
     */
    function resetAttribute() {
        var possibleInfobubbleImage = document.querySelector('[data-infobubble=shown]');
        if(possibleInfobubbleImage !== null) {
            possibleInfobubbleImage.dataset.infobubble = "show";
        }
    }

    /**
     * Find the offset of any element - used to position the infobubble
     * @param {Object} elm Any DOM element
     */
    function getOffset(elm) {
        var offsetX = elm.offsetLeft, offsetY = elm.offsetTop;
        return { x:offsetX, y:offsetY };
    }
    /* ------------------ END HELPER FUNCTIONS -------------- */

    /**
     * Shows or hides the infobubble according to:
     * - if this is an image, does it already have a 'show' attribute?
     * -- if yes, then show infobubble and change attribute to 'shown'
     * -- if not:
     * --- does it have a 'shown' attribute? if yes, then hide infobubble and replace 'shown' with 'show'
     * --- is it an infobubble-able image? if yes, add 'shown' attribute and display infobubble
     * @param {Event} e click event
     */
    function showOrHideBubble(e) {
        var callerImg = e.target;
        if(callerImg.nodeName !== "IMG") {
            hideBubble();
            resetAttribute();
        } else { // if it's an image
            if(callerImg.dataset.infobubble === "show") { // the image has been diagnosed as an infobubble caller
                // note: we use a 'data-' attribute because it prevents us from checking for image clickability every time
                showBubble(callerImg);
                resetAttribute();
                callerImg.dataset.infobubble = "shown"; // bubble is shown
            } else if(callerImg.dataset.infobubble === "shown") { // the image has already called the infobubble
                hideBubble();
                callerImg.dataset.infobubble = "show"; // please show bubble next time
            } else {
                var isExcluded = false; // by default the image is able to display the bubble
                var parents = getParents(callerImg); // we find all parents for the image
                parents.forEach( function (element) {
                     if (excludes.indexOf(element.nodeName.toLowerCase()) !== -1) { // if a parent is found in the 'excludes' then the image should not call the bubble
                        isExcluded = true;
                    }
                });
                if(!isExcluded) { // if image not excluded from collection
                    showBubble(callerImg);
                    resetAttribute();
                    callerImg.dataset.infobubble = "shown"; // bubble is shown
                    }
            }

        }
        e.stopPropagation();
    }
    
    /**
     * Fills the infobubble with the image's `alt` attribute and then shows it
     * @param {DOMElement} callerImg Image that is calling the infobubble action
     */
    function showBubble(callerImg) {
        hideBubble();
        var offset = getOffset(callerImg);
        infoBubbleText.innerText = callerImg.getAttribute("alt");
        document.querySelector('body').appendChild(infoBubble);
        infoBubble.style.left = (offset.x + parseInt(window.getComputedStyle(callerImg).width, 10)/2 - parseInt(window.getComputedStyle(infoBubble).width, 10)/2 ) + "px";
        infoBubble.style.top = (offset.y - parseInt(window.getComputedStyle(infoBubble).height, 10) ) + "px";
    }

    /**
     * Plain infobubble hiding
     */
    function hideBubble() {
        if(infoBubble.parentNode) { // if infobubble has a parent node then it's in the DOM
            infoBubble.parentNode.removeChild(infoBubble);
        }
    }

    /**
     * Script init
     */
    /* 1. style the bubble */
    styleBubble();
    /* 2. add behaviour on document (event delegation) */
    document.addEventListener("click",showOrHideBubble);

}

window.addEventListener("load",alttextfortouch);