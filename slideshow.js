/**
MANAGE SLIDESHOW OBJECTS


**/

function slideshowObj() {
	this.activePage;
	this.slideshow;
	this.pages;
	this.timer;
	this.pause;
	this.options;
	
	this.init = function() {
		var nbSlideshow = $(".slideshow").length;
		this.slideshow = document.createElement("div");
		this.slideshow.id="slideshow"+nbSlideshow;
		$id("draggable_area").appendChild(this.slideshow);
		this.slideshow.className = "draggable slideshow";
		
		var defaults = {
			delay: 3,
			animationSpeed: "normal",
			controls:false
		};
		this.options = defaults;
		this.pages = $(this.slideshow).find(".page");
		this.pages.hide();
		this.activePage = this.pages.first();
		var currentObj = this;
		this.pause = false;
		this.timer = setInterval(function(){currentObj.nextElt()}, (currentObj.options.delay*1000));
		
		this.addCtrl();
	}
	
	this.startpause = function() {
			var currentObj = this;
			if(this.pause)
			{
				this.pages.hide();
				this.timer = setInterval(function(){currentObj.nextElt()}, (currentObj.options.delay*1000));
				this.pages.find(".draggable").removeClass("draggable").addClass("notDraggable");
				this.pages.removeClass("bordered");
				this.pages.addClass("animate");
				
			}
			else
			{
				this.pages.show();
				this.pages.addClass("bordered");
				if(this.timer)
					clearInterval(this.timer);
				
				if(this.activePage)				
					this.activePage.removeClass("active");

				
					
				this.pages.find(".notDraggable").removeClass("notDraggable").addClass("draggable");
				this.pages.removeClass("animate");
				
			}
			this.pause = !this.pause;
	}
	
	this.nextElt = function()
	{
		// On cache de mani�re progressive l'image active
		this.activePage.fadeOut(this.options.animationSpeed);
		
		// Si l'image active courante n'est pas la derni�re image de la liste
		if(!this.activePage.is(this.pages.last()))
		{
			// Alors on cherche l'image suivante (".next()"), on lui ajoute la class "active",
			// et on retire cette classe � l'image pr�cedente (l'ancienne image active)
			 this.activePage.next().addClass("active").prev().removeClass("active");
			
			this.activePage = $(this.slideshow).find(".active");
			// On affiche la nouvelle image active progressivement
			this.activePage.fadeIn(this.options.animationSpeed);
		}
		// L'image est la derni�re de la liste
		else
		{
			// On fait la m�me chose mais en prenant la premi�re image de la liste via le s�lecteur "first-child"
			this.pages.first().addClass("active").fadeIn(this.options.animationSpeed);
			this.pages.last().removeClass("active");
			this.activePage = this.pages.first();
		}
	}
	
	this.addPage = function()
	{
		var newpage = document.createElement("div");
		var emptyImage = document.createElement("img");
		emptyImage.src = "empty.jpg";
		emptyImage.setAttribute("class", "toremove");
		var num = this.pages.length;
		num++;
		newpage.id = "slide"+num;
		newpage.setAttribute("class", "page bordered");
		
		newpage.appendChild(emptyImage);
		addDragEvent(newpage);
		this.slideshow.appendChild(newpage);
		this.pages = $(this.slideshow).find(".page");
		this.activePage = this.pages.first();	
		this.pause = false;
		this.startpause();

	}
	
	this.addCtrl = function()
	{
		var slideshowPositions = getAbsolutePosition(this.slideshow);
		var editButton = document.createElement("img");
		var slideshowObj = this;
		editButton.src="edit.png";
		editButton.setAttribute("class", "ctrl");
		
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
		var html = " Largeur : <input type=\"input\" name=\"width\" value=\"\"><br>"+
			          "Hauteur : <input type=\"input\" name=\"height\" value=\"\"><br>";
		var slideshowObj = this;
		var jquerySlideshow = $(this.slideshow);
		$(document).bind('close.facebox', function() {
			//slideshow.width=$('#facebox input[name=width]').val();
			//slideshow.height=$('#facebox input[name=width]').val() + "px";
			jquerySlideshow.width($('#facebox input[name=width]').val());
			jquerySlideshow.height($('#facebox input[name=height]').val());
			jquerySlideshow.find('.ctrl').remove();
			slideshowObj.addCtrl();
		});
		$.facebox(html);
		
		$('#facebox input[name=width]').val(this.slideshow.offsetWidth);
		$('#facebox input[name=height]').val(this.slideshow.offsetHeight);
		
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

 

