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
	var resizing = false;
	var dragFromOutside = false;
	var mouseX = 0;
	var mouseY = 0;
	var decalY = 0;
	var decalX = 0;
	var initialDragItemLeft = 0;
	var initialDragItemTop = 0;
	var dropbox = $id("draggable_area");
	var currentDragTarget = dropbox;
	var disableNextDrag = false;
	/**
	TOOLS
	**/
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
	
	
	function setElementPosToMouse(elt){
		var parentPos = getAbsolutePosition(elt.parentNode);

		elt.style.position = "absolute";	
		elt.style.top = mouseY-(parentPos["top"]-document.body.scrollTop)-(elt.clientY/2)-120;
		elt.style.left = mouseX-elt.clientWidth;
		//alert(mouseY + " - " + (mouseY-(elt.parentNode.offsetTop-document.body.scrollTop)-elt.clientY) + " " +elt.parentNode.id+" " +elt.parentNode.offsetTop);
	}
	
	function createNewElement(element,draggable){
		var newElt = document.createElement(element);

		currentDragTarget.appendChild(newElt);
		setElementPosToMouse(newElt);
		
		if(draggable)
			setElementDraggable(newElt);
		
		return newElt;
	}
	
	function deleteTemporaryImage(elt){
		var todelete = elt.getElementsByClassName("toremove");
		
		for(var i in todelete)
		{	
			elt.removeChild(todelete[i]);
		}
	}
	
	/**
	* Movement management
	**/
	
	function drag_drop_mouse_down(elt) {
	 currentDragItem = elt;
	 
	 if(mouseY >= (elt.offsetTop + elt.offsetHeight-100) && mouseX >= (elt.offsetLeft + elt.offsetWidth-100))
	 {
		resizing = true;
		Output("resizing! ");
	 }
	 else
	 {
		dragging = true;
	 }
	
	// coordinate = getAbsolutePosition(currentDragItem);
	 decalY = mouseY;
	 decalX = mouseX;
	 //Output("dragging! "+ id + "offset X : " + currentDragItem.offsetLeft+ " offset Y : " + currentDragItem.offsetTop);
	}
	
	function drag_drop_mouse_up(){
		dragging = false;
		resizing = false;
		if(currentDragItem)
		{
			currentDragItem.style.border="";
			currentDragItem = null;
		}
		//Output("stop dragging !");
		decalY = 0;
		decalX = 0;
	}
	
	var i = 0;
	function drag_drop_mouse_move(evt) {
		
		mouseX = evt.clientX;
		mouseY = evt.clientY;
		i++; 
		if(dragging && currentDragItem != null)
		{ 
			currentDragItem.style.border="solid 2px blue";
			
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
			
			 Output("dragging");
		}else if(resizing)
		{	
			currentDragItem.style.width = currentDragItem.offsetWidth + (mouseX - decalX);
			currentDragItem.style.height = currentDragItem.offsetHeight + (mouseY - decalY);
			Output("resizing");
		}
		
		//Output(mouseX + " - " + mouseY );
	}

	function drag_drop_mouse_over(elt) {
			Output(mouseX + " - " + mouseY + " -> " +elt.offsetTop + " "+ (elt.offsetHeight-100));
		if(mouseY >= (elt.offsetTop + elt.offsetHeight-100) && mouseX >= (elt.offsetLeft + elt.offsetWidth-100))
		{
			 document.body.style.cursor = "w-resize";
		}
		else{
			document.body.style.cursor = "move";
		}
	};
	
	function drag_drop_mouse_out(elt) {
		elt.style.border= "";
		document.body.style.cursor = "default";
		drag_drop_mouse_up();
	};
	

	/**$id("draggable_area").addEventListener('mousemove', function(evt){
        var mousePos = mouse_move(evt);
    }, false);
	$id("draggable_area").addEventListener('mouseup', function(evt){
        mouse_up();
    }, false);**/
		
	function initExistingDraggable()
	{
		var elements = getElementsByClassName("draggable");
		
		for(var i in elements)
		{
			setElementDraggable(elements[i]);
		}

		var elements = getElementsByClassName("page");
		for(var i in elements)
		{
			addDragEvent(elements[i]);
		}
	}
	
	function disableDragging(){
	  dragging = true;
	}
	
	function enableDragging(){
		dragging = false;
	}

	function deleteElement(elt,confirmPopup){
	
		if(confirmPopup)
		{
			elt.style.border="solid 2px red";
			disableNextDrag = true;
			if (confirm("Voulez-vous vraiment supprimer l'element selectionne en rouge? ")) {
				elt.parentNode.removeChild(elt);
			}else
			{
				elt.style.border="";
			}
		}else
		{
			elt.parentNode.removeChild(elt);
		}
	}
	
	function addDeleteButton(elt)
	{
		var deleteButton = document.createElement("img");
		deleteButton.src="img/delete.png";
		deleteButton.setAttribute("class", "dragctrl bigimg");
		deleteButton.style.top =  elt.offsetHeight;
		deleteButton.style.left = 0;
		elt.appendChild(deleteButton);
		
		deleteButton.addEventListener('mousedown', function(evt){
			deleteElement(elt,true);
		}, false);
	}
	
	function setElementDraggable(elt,ctrl){
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
		
		if(ctrl)
		{
			var moveButton = document.createElement("img");
			moveButton.src="img/move.png";
			moveButton.setAttribute("class", "dragctrl littleimg");
			elt.appendChild(moveButton);
			moveButton.style.top = -moveButton.offsetHeight;
			moveButton.style.left = -moveButton.offsetWidth/2;
			moveButton.addEventListener('mousedown', function(evt){
			setCurrentDraggingElement(elt);
			}, false);
			
		}
			elt.addEventListener('mousedown', function(evt){
				drag_drop_mouse_down(elt);
			}, true);
			elt.addEventListener('mouseover', function(evt){
				drag_drop_mouse_over(elt);
			}, true);
			elt.addEventListener('mouseout', function(evt){
				drag_drop_mouse_out(elt);
			}, true);
		
		
	}
	
	function setCurrentDraggingElement(elt)
	{
		drag_drop_mouse_down(elt);
	}
	
	function resetDragging()
	{
		drag_drop_mouse_up();
	}
	
	
	/**
	EXTERNAL DRAG/DROP MANAGEMENT
	**/
	
	//EVENT HANDLERS
	
	function dragenter(evt) {

	  evt.stopPropagation();
	  evt.preventDefault();
		
	if(dragging || resizing)
		return;
		
	  this.style.border="solid 2px blue";
	}
	
	function dragExit(evt) {
	  evt.stopPropagation();
	  evt.preventDefault();
	  
	  if(dragging || resizing)
		return;
		
	  this.style.border="";
	}
	
	function noopHandler(evt) {
	  evt.stopPropagation();
	  evt.preventDefault();
	}

	function drop(evt) {
	
	currentDragTarget = this;
	evt.stopPropagation();
	evt.preventDefault();
	
	if(dragging || resizing)
		return;
	
	if(disableNextDrag)	
	{
		disableNextDrag = false;
		return;
	}
	
	this.style.border="";
	 
	
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
	//---------------------------------------
	
	function addDragEvent(elt)
	{
		elt.addEventListener("drop", drop, false);
		elt.addEventListener("dragenter", dragenter, false);
		elt.addEventListener("dragexit", dragExit, false);
	}
	
	//file manager
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

	//file reader progress (not used)
	function handleReaderProgress(evt) {
		if (evt.lengthComputable) {
			var loaded = (evt.loaded / evt.total);

			//$("#progressbar").progressbar({ value: loaded * 100 });
		}
	}

	//load event (not used, use it to get a loading bar)
	function handleReaderLoadEnd(evt) {
		//$("#progressbar").progressbar({ value: 100 });

		//var img = document.getElementById("preview");
		var elt = createNewElement("img",true);
		elt.src = evt.target.result;
		
	}
	
	
	// init event handlers
	function initEvents()
	{
		dropbox.addEventListener("dragenter", noopHandler, false);
		dropbox.addEventListener("dragexit", dragExit, false);
		dropbox.addEventListener("dragover", noopHandler, false);
		dropbox.addEventListener("drop", drop, false);
		dropbox.addEventListener('mousemove', function(evt){
        var mousePos = drag_drop_mouse_move(evt);
		}, false);
		dropbox.addEventListener('mouseup', function(evt){
			drag_drop_mouse_up();
		}, false);
	}
	
	initEvents();
	initExistingDraggable();
