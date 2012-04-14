


function addSlideshow(){
	var newSlideshow = document.createElement("div");
	for(var i=0;i<=1000;i++){
				if(!$id("slideshow"+i))
				{
					newSlideshow.id = "slideshow"+i;
					break;
				}
	}
}


 var defaults = {
    delay: 3,
    animationSpeed: "normal",
    controls:false
};
var options = defaults;  // 1
 
 var num = 1;

 var obj =  $id("slideshow"+num);


 // On cache tous les éléments de la liste
 $(obj).find(".page").hide();
 var pages = $(obj).find(".page");
 var activepage = pages.first();
 var inter = null;
// pages.first().addClass("active").fadeIn(options.animationSpeed);
//pages.addClass("animate");
//var inter = setInterval(function(){nextElt(options)}, (options.delay*1000));

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
		
var pause = true;
startpause();
function startpause(){
	
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
}

function nextElt(options)
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
}


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

