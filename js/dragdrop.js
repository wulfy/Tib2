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
	var lastClick = null;
	var lastelt;
	
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
	
		
	//HTML5 et inf�rieurs
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

		elt.style.position = "relative";	
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
		var eltToDelete;
		
		for(var i=0;i< todelete.length; i++)
		{	
			if(todelete[i])
				elt.removeChild(todelete[i]);
		}
	}
	
	function reverse(n) {          // Reverse the order of the children of Node n
		var kids = n.childNodes;   // Get the list of children
		var numkids = kids.length; // Figure out how many there are
		for(var i = numkids-1; i >= 0; i--) {  // Loop through them backwards
			var c = n.removeChild(kids[i]);    // Remove a child
			n.appendChild(c);                  // Put it back at its new position
		}
	}

	function reset(elt) {
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
		
		if(elt)
			elt.style.border= "";
			
		document.body.style.cursor = "default";
	
	}
	
	
	function reRenderElement(elt)
	{
		elt.style.display = 'none';
		elt.style.display = 'block';
	
	}
	
	
	/**
	* Movement management
	**/
	
	function double_click(elt){
	
		var html = 	 elt.id +  " <br>Largeur : <input type=\"input\" name=\"width\" value=\"\"><br>"+
			          "Hauteur : <input type=\"input\" name=\"height\" value=\"\"><br>"+
					  "supprimer element <img src='img/delete.png' id='delete' class='ctrl littleimg'><br>";
	  

	   var jqueryelt = $(elt);
		$(document).bind('close.facebox', function() {
			jqueryelt.width($('#facebox input[name=width]').val());
			jqueryelt.height($('#facebox input[name=height]').val());
		});
		
		var facebox = $.facebox(html);
		var currentObj = this;
		$("#facebox #delete").click(function() {
				deleteElement(elt,true);
				$.facebox.close();
		});
		$('#facebox input[name=width]').val(elt.clientWidth);
		$('#facebox input[name=height]').val(elt.clientHeight);
	}
	
	function drag_drop_mouse_down(elt) {
	 currentDragItem = elt;
	 var time = null;

	
	 
	 if(mouseY >= (elt.offsetTop + elt.offsetHeight-elt.offsetHeight/4) && mouseX >= (elt.offsetLeft + elt.offsetWidth-elt.offsetWidth/4))
	 {
		resizing = true;
		dragging = false;
		Output("resizing! down "+mouseY+ "  " + elt.offsetTop + " + " + elt.offsetHeight + "/" + mouseX+ " " + (elt.offsetLeft + elt.offsetWidth-10));
	 }
	 else
	 {
		dragging = true;
		resizing = false;
		Output("dragging down"+mouseY+ "  " + elt.offsetTop + " + " + elt.offsetHeight + "/" + mouseX+ " " + (elt.offsetLeft + elt.offsetWidth-10));
	 }
	 
		var time = new Date().getTime();
		
		if(lastelt)
		{
			//alert("elt id:" + elt.id  + " latest " + lastelt.id );
			if((time - lastClick ) < 200 && lastClick > 0 && (elt.id == lastelt.id ||elt.parentNode == lastelt))
				double_click(elt);
		}

		lastClick = time;

	
	// coordinate = getAbsolutePosition(currentDragItem);
	 decalY = mouseY;
	 decalX = mouseX;
	 lastelt = elt;
	 //Output("dragging! "+ id + "offset X : " + currentDragItem.offsetLeft+ " offset Y : " + currentDragItem.offsetTop);
	}
	
	function drag_drop_mouse_up(){
		reset();
	}
	
	var i = 0;
	function drag_drop_mouse_move(evt) {
		
		mouseX = evt.clientX;
		mouseY = evt.clientY;
		i++; 
		if(dragging && currentDragItem != null)
		{    document.body.style.cursor = "move";
			currentDragItem.style.border="solid 2px blue";
			
			//initialise si undifined
			if(!currentDragItem.style.top)
				currentDragItem.style.top = 0;
			
			if(!currentDragItem.style.left)
				currentDragItem.style.left = 0;
			
			var top = currentDragItem.offsetTop - currentDragItem.parentNode.offsetTop;
			var left = currentDragItem.offsetLeft - currentDragItem.parentNode.offsetLeft;
				
			//deplace l element
			if( (top > 0 || mouseY > decalY)
				&& 
				(top+currentDragItem.offsetHeight < currentDragItem.parentNode.offsetHeight || (mouseY < decalY))
				)
				currentDragItem.style.top = parseInt(currentDragItem.style.top) + (mouseY - decalY);

				
			if( (left > 0 || mouseX > decalX)
				&& 
				(left+currentDragItem.offsetWidth < currentDragItem.parentNode.offsetWidth ||  (mouseX < decalX)) 
				)
				currentDragItem.style.left = parseInt(currentDragItem.style.left) + (mouseX - decalX);
			
			
			
			 Output("dragging " + top + " " + currentDragItem.parentNode.offsetHeight );
		}else if(resizing)
		{	 document.body.style.cursor = "w-resize";
			currentDragItem.style.width = currentDragItem.offsetWidth + (mouseX - decalX);
			currentDragItem.style.height = currentDragItem.offsetHeight + (mouseY - decalY);
			//reRenderElement(currentDragItem);
			/**$(currentDragItem.id).width((currentDragItem.offsetWidth + (mouseX - decalX)));
			$(currentDragItem.id).height((currentDragItem.offsetHeight + (mouseY - decalY)));**/
			Output("resizing");
		}
		decalY = mouseY;
		decalX = mouseX;
		//Output(mouseX + " - " + mouseY );
	}

	function drag_drop_mouse_over(elt) {
			Output(mouseX + " - " + mouseY + " -> " +elt.offsetTop + " "+ (elt.offsetHeight-100));
		/**if(mouseY >= (elt.offsetTop + elt.offsetHeight-100) && mouseX >= (elt.offsetLeft + elt.offsetWidth-100))
		{
			 document.body.style.cursor = "w-resize";
		}
		else{
			document.body.style.cursor = "move";
		}**/
	};
	
	function drag_drop_mouse_out(elt) {
	
		if(!resizing)
			reset(elt);
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
		deleteButton.setAttribute("class", "dragctrl bigimg left");
		deleteButton.style.top =  elt.offsetHeight;
		deleteButton.style.left = 0;
		elt.appendChild(deleteButton);
		
		deleteButton.addEventListener('mousedown', function(evt){
		evt.stopPropagation();
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
		elt.setAttribute("onmousedown","if (event.preventDefault) event.preventDefault()");
		
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
				 evt.stopPropagation();
			}, false);
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
		if(dragging || resizing)
			return;
	  evt.stopPropagation();
	  evt.preventDefault();
		
	
		
	  this.style.border="solid 2px blue";
	}
	
	function dragExit(evt) {
	 
	  
	  if(dragging || resizing)
		return;
		
	 evt.stopPropagation();
	  evt.preventDefault();
	  
	  this.style.border="";
	}
	
	function noopHandler(evt) {
	
	if(dragging || resizing)
		return;
		
	  evt.stopPropagation();
	  evt.preventDefault();
	}

	function drop(evt) {
	if(dragging || resizing)
		return;
		
	currentDragTarget = this;
	evt.stopPropagation();
	evt.preventDefault();
	
	
	
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
