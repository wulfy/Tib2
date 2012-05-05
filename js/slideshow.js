/**
MANAGE SLIDESHOW OBJECTS

@author:ludovic
**/

function slideshowObj() {

	this.activePage;
	this.slideshow;
	this.pages;
	this.open;
	this.timer;
	this.pause;
	this.options;
	this.animator;
	this.jquerySlideshow;
	
	var colors = ["#990099","#3300CC","#CC0099","#000033","#990033","#000000"];                
	 
	
	this.init = function(parentId,slideshowId,addCtrlButtons) {
		if (typeof parentId == "undefined") {
				parentId = "draggable_area";
		}
		
		if (typeof addCtrlButtons == "undefined") {
				addCtrlButtons = true;
		}
		
		var nbSlideshow = $(".slideshow").length;
		this.slideshow = document.createElement("div");
		
		if (typeof slideshowId == "undefined") {
				slideshowId = "slideshow"+nbSlideshow;
		}

		this.slideshow.id=slideshowId;
		
		$id(parentId).appendChild(this.slideshow);
		this.slideshow.className = "draggable slideshow borderedYellow";
		this.jquerySlideshow = $(this.slideshow);
		
		var defaults = {
			delay: 3,
			animationSpeed: "normal",
			controls:false
		};
		this.options = defaults;
		this.pages = this.jquerySlideshow.find(".page");
		this.pages.hide();
		this.activePage = this.pages.first();
		var currentObj = this;
		this.pause = false;
		this.open = true;
		//this.timer = setInterval(function(){currentObj.nextElt()}, (currentObj.options.delay*1000));
		
		if(addCtrlButtons)
			this.addCtrl();
			
		this.setdraggable();
		this.animator = new animatorAlternate();
	}
	
	this.startpause = function() {
			this.animator.startpause();
	}
	
	this.nextElt = function()
	{
		
		this.animator.animate();
		 // On cache de manière progressive l'image active
	}
	
	this.addPage = function(addCtrlButtons)
	{
		if (typeof addCtrlButtons == "undefined") {
				addCtrlButtons = true;
		}

		var newpage = document.createElement("div");
		//var emptyImage = document.createElement("img");
		var emptyText = document.createElement("div");
		//emptyImage.src = "img/empty.jpg";
		
		//emptyImage.setAttribute("class", "toremove");
		//emptyImage.setAttribute("onmousedown","if (event.preventDefault) event.preventDefault()");
		emptyText.setAttribute("class", "toremove");
		var num = this.pages.length;
		num++;
		newpage.id = "slide"+num;
		
		var rand = Math.floor(Math.random()*colors.length);
		var jqueryEmptyText = $(emptyText);
		jqueryEmptyText.html("<h1>slide"+num+"</h1><i>Pas d'image!</i>");
		jqueryEmptyText.css("background-color", colors[rand]);

		newpage.setAttribute("class", "page borderedGrey");
		
		//newpage.appendChild(emptyImage);
		newpage.appendChild(emptyText);
		
		if(addCtrlButtons)
			addDeleteButton(newpage);
		
		addDragEvent(newpage);
		this.slideshow.appendChild(newpage);
		
		
		this.pages = this.jquerySlideshow.find(".page");
		this.animator.init(this.pages);
		this.openPages();
	}
	
	this.addCtrl = function()
	{
		var slideshowPositions = getAbsolutePosition(this.slideshow);
		var editButton = document.createElement("img");
		
		var slideshowObj = this;
		editButton.src="img/edit.png";
		
		editButton.setAttribute("class", "ctrl bigimg right");
		
		this.slideshow.appendChild(editButton);

		editButton.style.top = -(editButton.offsetHeight/2);
		editButton.style.left = this.slideshow.offsetWidth-editButton.offsetWidth;

		editButton.addEventListener('click', function(evt){
			slideshowObj.edit();
		}, false);
	}
		
	this.edit = function()
	{
		//$.facebox({ ajax: 'edit.html' });
		var animatorName = this.animator.getName();
		var currentObj = this;
		var selectedAnimator;
		currentObj.animator.stop();
		currentObj.openPages();
		
		var html = 	  " Largeur : <input type=\"input\" name=\"width\" value=\"\"><br>"+
			          "Hauteur : <input type=\"input\" name=\"height\" value=\"\"><br>"+
					  "Animation : <select id='animationselector'>"+
									"<option value='"+animatorName+"'>"+animatorName+"</option>"+
									  "<option value='Fade'>Fade</option>"+
									  "<option value='Slide'>Slide</option>"+
									  "<option value='Alternate'>Alternate</option>"+
									"</select> <br>"+
					  "<div id='animatorexample'> </div>"+
					  "Replier/deplier : <img src='openclose.png' id='openclose' class='ctrl littleimg'> <br>"+
					  "ajouter une ligne <img src='img/add.png' id='add' class='ctrl littleimg'><br>" +
					  "<script>var exampleSlideshow = new slideshowObj();"+
						" exampleSlideshow.init('animatorexample','slideshowExample',false); exampleSlideshow.addPage(false);  exampleSlideshow.addPage(false);   exampleSlideshow.closePages();"+
						"exampleSlideshow.animator = new animator"+animatorName+"(); exampleSlideshow.animator.init(exampleSlideshow.pages) ; exampleSlideshow.animator.start();</script>" ;
		
		if(this.animator.pause){
			html +="lancerAnimation <img src='img/run.png' id='startpause' class='ctrl littleimg'><br>";		  
		}else
		{
			html +="stopper animation <img src='img/pause.png' id='startpause' class='ctrl littleimg'><br>";	
		}
		html +="supprimer animation <img src='img/delete.png' id='delete' class='ctrl littleimg'><br>";
		
		html +="<hr><input type='button' id='save' value='appliquer' name='appliquer'><br>";
		
		var slideshowObj = this;
		var jquerySlideshow = this.jquerySlideshow;

		$(document).bind('close.facebox', function() {
			/** //slideshow.width=$('#facebox input[name=width]').val();
			//slideshow.height=$('#facebox input[name=width]').val() + "px";
			jquerySlideshow.width($('#facebox input[name=width]').val());
			jquerySlideshow.height($('#facebox input[name=height]').val());
			jquerySlideshow.find('.ctrl').remove();
			slideshowObj.addCtrl();
			alert(jquerySlideshow.attr("id"));**/
		});
		var facebox = $.facebox(html);
		
		$("#facebox #add").click(function() {
			currentObj.addPage();	
		});
		$("#facebox #animationselector").change(function() {
			var value = $(this).val();
			if(animatorName != value)
			{
				selectedAnimator = value;
				
				exampleSlideshow.closePages();
				exampleSlideshow.animator.stop();
				exampleSlideshow.animator  = eval("new animator"+value+"()");
				exampleSlideshow.animator.init(exampleSlideshow.pages);
				exampleSlideshow.animator.start();	
			}
		});
		$("#facebox #openclose").click(function() {
			if(currentObj.open)
				currentObj.closePages();
			else
				currentObj.openPages();	
		});
		$("#facebox #startpause").click(function() {
		
				if(currentObj.animator.pause)
					currentObj.closePages();
				else
					currentObj.openPages();
				
				currentObj.animator.startpause();
				$.facebox.close();	
		});
		$("#facebox #delete").click(function() {
				deleteElement(currentObj.slideshow,true);
				$.facebox.close();
		});
		
		$("#facebox #save").click(function() {
							//slideshow.width=$('#facebox input[name=width]').val();
			//slideshow.height=$('#facebox input[name=width]').val() + "px";
			jquerySlideshow.width($('#facebox input[name=width]').val());
			jquerySlideshow.height($('#facebox input[name=height]').val());
			//jquerySlideshow.find('.ctrl').remove();
			//slideshowObj.addCtrl();
			
			if(selectedAnimator)
			{
				currentObj.animator.stop();	
				currentObj.animator = eval("new animator"+selectedAnimator+"()");
				currentObj.animator.init(currentObj.pages);
			}
			
			$.facebox.close();
		});
		
		$('#facebox input[name=width]').val(this.slideshow.offsetWidth);
		$('#facebox input[name=height]').val(this.slideshow.offsetHeight);
		
	}
	
	this.setdraggable = function(){
		setElementDraggable(this.slideshow,true);
	}
	
	this.openPages = function() {
	
		this.pages.show();
		this.pages.addClass("borderedGrey").addClass("opened");
		this.jquerySlideshow.removeClass("borderedYellow").addClass("opened");

		
		if(this.timer)
			clearInterval(this.timer);
		
		if(this.currentSlide)				
			this.currentSlide.removeClass("active");

		this.pages.find(".notDraggable").removeClass("notDraggable").addClass("draggable");
		this.pages.removeClass("animate");
		this.pages.show();
		this.pages.css("opacity","1");
		this.jquerySlideshow.css("z-index","");
		
		this.open = true;
	
	}
	
	this.closePages = function() {
		this.pages.hide();
		this.pages.find(".draggable").removeClass("draggable").addClass("notDraggable");
		this.pages.removeClass("opened").removeClass("borderedGrey");
		this.jquerySlideshow.removeClass("opened");
		this.currentSlide = this.pages.first();
		this.jquerySlideshow.removeClass("opened").addClass("borderedYellow");
		this.open = false;
	}
	
	this.getId = function() {
		return this.slideshow.id;
	}
	
}

var slideshows = new Array();
var numberSlideshow = 0;
function addSlideshow(){
	numberSlide = slideshows.length;
	newSlideshow = new slideshowObj();
	newSlideshow.init();
	newSlideshow.addPage();
	if(numberSlide>0)
		newSlideshow.slideshow.style.top = slideshows[numberSlide-1].slideshow.style.top+slideshows[numberSlide-1].slideshow.offsetHeight;
		
	slideshows[numberSlide] = newSlideshow;
}


var button = document.createElement("input");
button.type = "button";
button.value = "stop animation";
$id("control_panel").appendChild(button);
		
 button.addEventListener('click', function(evt){
			startpause();
		}, false);

$("#addPageButton").click(function() {
			addPage(obj);
		});
		
addSlideshow();
addSlideshow();

 

