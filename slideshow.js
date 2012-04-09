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
		// On cache de manière progressive l'image active
		this.activePage.fadeOut(this.options.animationSpeed);
		
		// Si l'image active courante n'est pas la dernière image de la liste
		if(!this.activePage.is(this.pages.last()))
		{
			// Alors on cherche l'image suivante (".next()"), on lui ajoute la class "active",
			// et on retire cette classe à l'image précedente (l'ancienne image active)
			 this.activePage.next().addClass("active").prev().removeClass("active");
			
			this.activePage = $(this.slideshow).find(".active");
			// On affiche la nouvelle image active progressivement
			this.activePage.fadeIn(this.options.animationSpeed);
		}
		// L'image est la dernière de la liste
		else
		{
			// On fait la même chose mais en prenant la première image de la liste via le sélecteur "first-child"
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

addSlideshow();
addSlideshow();
 /**var defaults = {
    delay: 3,
    animationSpeed: "normal",
    controls:false
};**/
//var options = defaults;  // 1
 
 //var num = 1;

 //var obj =  $id("slideshow"+num);

 /**
 var slideshows = $(".slideshow");
 // On cache tous les éléments de la liste
 slideshows.find(".page").hide();
 var pages = slideshows.find(".page");
 var activepage = pages.first();
 var inter = null;
// pages.first().addClass("active").fadeIn(options.animationSpeed);
//pages.addClass("animate");
//var inter = setInterval(function(){nextElt(options)}, (options.delay*1000));
**/
var button = document.createElement("input");
button.type = "button";
button.value = "stop animation";
$id("control_panel").appendChild(button);
		
 button.addEventListener('click', function(evt){
			startpauseall();
		}, false);

$("#addPageButton").click(function() {
			addPageall();
		});

function startpauseall(){
	for(i in slideshows)
		slideshows[i].startpause();
}

function addPageall(){
	for(i in slideshows)
		slideshows[i].addPage();
}
		
//var pause = true;
//startpause();
/**function startpause(){
	
	if(pause)
	{
		pages.hide();
		inter = setInterval(function(){nextElt(options)}, (options.delay*1000));
		pages.find(".draggable").removeClass("draggable").addClass("notDraggable");
		pages.removeClass("bordered");
		pages.addClass("animate");
		
	}
	else
	{
		pages.show();
		pages.addClass("bordered");
		if(inter)
			clearInterval(inter);
			
		activepage.removeClass("active");
		pages.find(".notDraggable").removeClass("notDraggable").addClass("draggable");
		pages.removeClass("animate");
		
	}
	pause = !pause;
}**/

/**function nextElt(options)
{
    // On cache de manière progressive l'image active
    activepage.fadeOut(options.animationSpeed);
	
    // Si l'image active courante n'est pas la dernière image de la liste
    if(!activepage.is(pages.last()))
    {
        // Alors on cherche l'image suivante (".next()"), on lui ajoute la class "active",
        // et on retire cette classe à l'image précedente (l'ancienne image active)
         activepage.next().addClass("active").prev().removeClass("active");
		
		activepage = $(obj).find(".active");
        // On affiche la nouvelle image active progressivement
        activepage.fadeIn(options.animationSpeed);
    }
    // L'image est la dernière de la liste
    else
    {
        // On fait la même chose mais en prenant la première image de la liste via le sélecteur "first-child"
        pages.first().addClass("active").fadeIn(options.animationSpeed);
        pages.last().removeClass("active");
		activepage = pages.first();
    }
}**/


function addPage(slideshowObj)
{
	var newpage = document.createElement("div");
	var emptyImage = document.createElement("img");
	emptyImage.src = "empty.jpg";
	emptyImage.setAttribute("class", "toremove");
	var num = $(slideshowObj).find(".page").length;
	num++;
	newpage.id = "slide"+num;
	newpage.setAttribute("class", "page bordered");
	
	newpage.appendChild(emptyImage);
	addDragEvent(newpage);
	slideshowObj.appendChild(newpage);
	pages = $(obj).find(".page");
	pause = false;
	startpause();

}

