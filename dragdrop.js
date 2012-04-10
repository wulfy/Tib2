/**(function() {

	// getElementById
	function $id(id) {
		return document.getElementById(id);
	}
	
	// output information
	function Output(msg) {
		var m = $id("messages");
		m.innerHTML = msg + m.innerHTML;
	}
	
	function getElementClicked(){
	elem = document.elementFromPoint(2, 2);
	elem.style.background = "yellow";
	}
	

	function mouse_over() {
		this.style.background = "yellow";
	};
	})();**/

	
	
	var currentDragItem = null;
	var dragging = false;
	var dragFromOutside = false;
	var mouseX = 0;
	var mouseY = 0;
	var decalY = 0;
	var decalX = 0;
	var initialDragItemLeft = 0;
	var initialDragItemTop = 0;
	
	function $id(id) {
		return document.getElementById(id);
	}
	
	function Output(msg) {
		var m = $id("messages");
		m.innerHTML = msg;
	}
	
	function getAbsolutePosition(elt)
	{
		 var returnArray = new Array();
		 var curleft = 0;
		 var curtop = 0;
		 
		if (elt.offsetParent) {
		do {
			curleft += elt.offsetLeft;
			curtop += elt.offsetTop;
		} while (elt = elt.offsetParent);

	
		}
		
		returnArray["left"] = curleft;
		returnArray["top"] = curtop;
		
		return returnArray;
	}
	
	function mouse_down(id) {
	 currentDragItem = $id(id);
	 dragging = true;
	 
	// coordinate = getAbsolutePosition(currentDragItem);
	 decalY = mouseY;
	 decalX = mouseX;
	 Output("dragging! "+ id + "offset X : " + currentDragItem.offsetLeft+ " offset Y : " + currentDragItem.offsetTop);
	}
	
	function mouse_up(){
		dragging = false;
		currentDragItem = null;
		//Output("stop dragging !");
		decalY = 0;
		decalX = 0;
		
	}
	
	function getFirstParentWithClass(elt)
	{
		var parent = null;
		var currentParent = elt;
		
		while(currentParent.parentNode)
		{
		     currentParent = currentParent.parentNode;
			 
			if((' ' + currentParent.className + ' ').indexOf(' ' + "draggable" + ' ') > -1)
			{
				parent = currentParent;
				break;
			}
			
		}
		
		return parent;
	}
	var i = 0;
	function mouse_move(evt) {
		mouseX = evt.clientX;
		mouseY = evt.clientY;
		i++;
		if(dragging && currentDragItem != null)
		{
			//initialise si undifined
			if(!currentDragItem.style.top)
				currentDragItem.style.top = 0;
			
			if(!currentDragItem.style.left)
				currentDragItem.style.left = 0;

			
			//deplace l element
			if( (currentDragItem.offsetTop > 0 || (mouseY - decalY) > 0)
				&& 
				((currentDragItem.offsetTop + currentDragItem.offsetHeight)  <  currentDragItem.offsetParent.offsetHeight || (mouseY - decalY) < 0)
				)
				currentDragItem.style.top = parseInt(currentDragItem.style.top) + (mouseY - decalY);

				
			if( (currentDragItem.offsetLeft > 0 || (mouseX - decalX) > 0)
				&& 
				((currentDragItem.offsetLeft + currentDragItem.offsetWidth) <  currentDragItem.offsetParent.offsetWidth  ||  (mouseX - decalX)< 0 ) 
				)
				currentDragItem.style.left = parseInt(currentDragItem.style.left) + (mouseX - decalX);
			
			decalY = mouseY;
			decalX = mouseX;
			
			 Output(currentDragItem.style.top + " - " + currentDragItem.style.left);
			/**firstparent = getFirstParentWithClass(currentDragItem);
			if(firstparent)
			{
				if(currentDragItem.offsetTop > (firstparent.clientTop + firstparent.clientHeight))
					currentDragItem.style.top = firstparent.clientTop + firstparent.offsetHeight;
				
				if(currentDragItem.offsetTop < (firstparent.offsetTop)){
					currentDragItem.style.top = firstparent.clientTop;
					Output(currentDragItem.id + " " + currentDragItem.clientTop + " r-r " + currentDragItem.offsetTop);
					}
				if((mouseX - initialX) > (firstparent.offsetLeft + firstparent.offsetWidth))
					currentDragItem.style.left = firstparent.offsetLeft - currentDragItem.offsetLeft ;
					
				if((mouseX - initialX) < (firstparent.offsetLeft))
					currentDragItem.style.left = firstparent.offsetLeft;
			}**/
			//Output(currentDragItem.style.top + " - mouse " + mouseY + " initial : " + initialY);
		}
		Output(mouseX + " - " + mouseY );
	}
	
	//HTML5 et inférieurs
	function getElementsByClassName(classname, node) {
		if(!node) node = document.getElementsByTagName("body")[0];
			var a = [];
			var re = new RegExp('\\b' + classname + '\\b');
			var els = node.getElementsByTagName("*");
			for(var i=0,j=els.length; i<j; i++)
				if(re.test(els[i].className))
					a.push(els[i]);
		return a;
    }
	
	//HTML5
	function getElementsByData(dataname, datavalue, node) {
		if(!node) node = document.getElementsByTagName("body")[0];
			var a = [];
			var re = new RegExp('\\b' + datavalue + '\\b');
			var els = node.getElementsByTagName("*");
			for(var i=0,j=els.length; i<j; i++)
				if(re.test(els[i].dataset.eval(dataname)))
					a.push(els[i]);
		return a;
    }
	
	function mouse_over(id) {
		$id(id).style.border="solid 2px red";
		document.body.style.cursor = "move";
	};
	
	function mouse_out(id) {
		$id(id).style.border= "";
		document.body.style.cursor = "default";
	};
	
	$id("draggable_area").addEventListener('mousemove', function(evt){
        var mousePos = mouse_move(evt);
    }, false);
	$id("draggable_area").addEventListener('mouseup', function(evt){
        mouse_up();
    }, false);
	
	var elements = getElementsByClassName("draggable");
	
	for(var i in elements)
	{
		setElementDraggable(elements[i]);
	}
	
	dropbox = $id("draggable_area");
	
	
	var elements = getElementsByClassName("page");
	for(var i in elements)
	{
		addDragEvent(elements[i]);
	}
	
	function addDragEvent(elt)
	{
		elt.addEventListener("drop", drop, false);
		elt.addEventListener("dragenter", dragenter, false);
		elt.addEventListener("dragexit", dragExit, false);
	}
	
	var currentDragTarget = dropbox;
	
	function setElementPosToMouse(elt){
		var parentPos = getAbsolutePosition(elt.parentNode);

		elt.style.position = "absolute";	
		elt.style.top = mouseY-(parentPos["top"]-document.body.scrollTop)-(elt.clientHeight/2)-120;
		elt.style.left = mouseX-elt.clientWidth;
		//alert(mouseY + " - " + (mouseY-(elt.parentNode.offsetTop-document.body.scrollTop)-elt.clientHeight) + " " +elt.parentNode.id+" " +elt.parentNode.offsetTop);
	}
	
	function setElementDraggable(elt){
		if((' ' + elt.className + ' ').indexOf(' ' + "draggable" + ' ') == -1)
			elt.className += "draggable";

		if(!elt.id)
			for(var i=0;i<=1000;i++){
				if(!$id(elt.tagName+i))
				{
					elt.id = elt.tagName+i;
					break;
				}
			}
		

		elt.addEventListener('mousedown', function(evt){
			mouse_down(elt.id);
		}, true);
		elt.addEventListener('mouseover', function(evt){
			mouse_over(elt.id);
		}, true);
		elt.addEventListener('mouseout', function(evt){
			mouse_out(elt.id);
		}, true);
		
		
	}
	
	function createNewElement(element,draggable){
		var newElt = document.createElement(element);

		currentDragTarget.appendChild(newElt);
		setElementPosToMouse(newElt);
		
		if(draggable)
			setElementDraggable(newElt);
		
		return newElt;
	}
	
	
	
	
	function dragenter(evt) {
	  evt.stopPropagation();
	  evt.preventDefault();
	  this.style.border="solid 2px blue";
	}
	
	function dragExit(evt) {
	  evt.stopPropagation();
	  evt.preventDefault();
	  this.style.border="";
	}
	
	function noopHandler(evt) {
	  evt.stopPropagation();
	  evt.preventDefault();
	}
	
	
	function deleteTemporaryImage(elt){
		var todelete = elt.getElementsByClassName("toremove");
		
		for(var i in todelete)
		{
			elt.removeChild(todelete[i]);
		}
	}
	
	function drop(evt) {
	
	currentDragTarget = this;
	evt.stopPropagation();
	evt.preventDefault();
	this.style.border="";
	 if(dragging == true)
		return;
	 
	 
	  var files = evt.dataTransfer.files;
	  var count = files.length;
	 

	 
	  // Only call the handler if 1 or more files was dropped.
	  if (count > 0)
		 handleFiles(files);
	  else
		 if(evt.dataTransfer.getData("Text").length>0)
		 {
			file = evt.dataTransfer.getData("Text");
			newElt = createNewElement("img",true);
			newElt.src = file;
		 }

		//suppression image temporaire
		deleteTemporaryImage(currentDragTarget);
	   //var file = files[0];
	   
	   //Output("Processing " + file.name);
	   
	}
	
	
	function handleFiles(files) {
		var file = files[0];

		if(file)
		{
			var reader = new FileReader();

			// init the reader event handlers
			reader.onprogress = handleReaderProgress;
			reader.onloadend = handleReaderLoadEnd;
			
			// begin the read operation
			reader.readAsDataURL(file);
		}
	}

	function handleReaderProgress(evt) {
		if (evt.lengthComputable) {
			var loaded = (evt.loaded / evt.total);

			//$("#progressbar").progressbar({ value: loaded * 100 });
		}
	}

	function handleReaderLoadEnd(evt) {
		//$("#progressbar").progressbar({ value: 100 });

		//var img = document.getElementById("preview");
		var elt = createNewElement("img",true);
		elt.src = evt.target.result;
		
	}
	
	
		// init event handlers
	dropbox.addEventListener("dragenter", noopHandler, false);
	dropbox.addEventListener("dragexit", dragExit, false);
	dropbox.addEventListener("dragover", noopHandler, false);
	dropbox.addEventListener("drop", drop, false);
