/**
MANAGE ANIMATION EFFECT

@author:ludovic
**/

function animator() {
	this.options;
	this.slides;
	this.pause;
	this.currentSlide;
	this.defaults = {
			delay: 3,
			animationSpeed: "normal",
			controls:false
		};
		
	this.init = function(objectList) {
		this.options = this.defaults;
		this.pause = true;
		this.slides = objectList;
		this.currentSlide = this.slides.first();
		//this.timer = setInterval(function(){currentObj.animate()}, (currentObj.options.delay*1000));
		//this.startpause();
	}
	
	this.startpause = function() {
			var currentObj = this;
			if(this.pause)
			{
				this.slides.hide();
				this.timer = setInterval(function(){currentObj.animate()}, (currentObj.options.delay*1000));
				this.slides.find(".draggable").removeClass("draggable").addClass("notDraggable");
				this.slides.removeClass("bordered");
				this.slides.addClass("animate");
				this.currentSlide = this.slides.first();
			}
			else
			{
				this.slides.show();
				this.slides.addClass("bordered");
				
				if(this.timer)
					clearInterval(this.timer);
				
				if(this.currentSlide)				
					this.currentSlide.removeClass("active");

				this.slides.find(".notDraggable").removeClass("notDraggable").addClass("draggable");
				this.slides.removeClass("animate");
				this.slides.show();
				this.slides.css("opacity","1");
				obj.css("z-index","");
			}
			this.pause = !this.pause;
	}
	
	this.animate = function(){
	
		this.animout(this.currentSlide);
		// Si l'image active courante n'est pas la dernière image de la liste
		if(!this.currentSlide.is(this.slides.last()))
		{
			// Alors on cherche l'image suivante (".next()"), on lui ajoute la class "active",
			// et on retire cette classe à l'image précedente (l'ancienne image active)
			 this.currentSlide.next().addClass("active").prev().removeClass("active");
			
		   //this.currentSlide = $(this.currentSlide.parentNode).find(".active");
			this.currentSlide = this.currentSlide.next();		
			this.animin(this.currentSlide);

		}
		// L'image est la dernière de la liste
		else
		{
			this.slides.last().removeClass("active");
			this.currentSlide = this.slides.first();
			// On fait la même chose mais en prenant la première image de la liste via le sélecteur "first-child"
			this.animin(this.slides.first().addClass("active"));
		}
	}

	this.animin = function(obj){
	//todefine in child class
	}
	this.animout = function(obj){
	//todefine in child class
	}
	
}

function animatorFade() {

	animator.call(this); // Héritage
	
	this.animin = function(obj) {
		obj.fadeIn(this.options.animationSpeed);
	}
	
	this.animout = function(obj) {
		obj.fadeOut(this.options.animationSpeed);
	}
}

function animatorSlide() {

	animator.call(this); // Héritage
	
	this.animin = function(obj){
		obj.css('left', - obj.width());
		obj.css("visibility","visible");
		obj.css("z-index","10");
		obj.show();
		//this.currentSlide.show();
		// On affiche la nouvelle image active progressivement
		obj.animate({"left":0},this.options.animationSpeed, "linear", null);
	}
	
	this.animout = function(obj){
		obj.css("z-index","");
		obj.animate({"left":-obj.width()},this.options.animationSpeed, "linear", null);
		//obj.fadeOut(this.options.animationSpeed);
	}
}

function animatorAlternate() {

	animator.call(this); // Héritage
	
	this.animin = function(obj){
		this.currentSlide.css("opacity","0");
		this.currentSlide.css("visibility","visible");
		//this.currentSlide.show();
		// On affiche la nouvelle image active progressivement
		this.currentSlide.animate({"opacity":1},300, "linear", null);
	}
	
	this.animout = function(obj){
		this.currentSlide.css("opacity","1");
		this.currentSlide.animate({"opacity":0},300, "linear", null);
		this.currentSlide.css("visibility","hidden");
		//this.currentSlide.hide();
	}
}

 

