/**
 * Squiggle jQuery plug-in
 * Scribble out your content with a Squiggle
 *
 * @author Jean-Christophe Nicolas <mrjcnicolas@gmail.com>
 * @homepage http://bite-software.co.uk/squiggle/
 * @version 0.4.0
 * @license MIT http://opensource.org/licenses/MIT
 * @date 2013-09-13
 */
/*
(function($) {

  $.fn.squiggle = function(options){
    
    var el = $(this),
      process = new Plugin(el,options);
        
    return this.el;	
  }
*/
/*
  var Plugin = function(self,options){
  
    this.config = {	
      intensity:30,
      thickness:false,
      color:false,
      hover:false
    }
    $.extend(this.config,options);
  
    this.el = self;
    this.points = [];
    
    this.init();
  
    if(this.config.hover){
      $this = this;
  
      this.el.on('mouseover',function(){
        $this.hideSquiggle();
      })
      this.el.on('mouseout',function(){
        $this.showSquiggle();
      })
    }
  }
  
  Plugin.prototype.init = function(){
  
    this.cWidth = parseInt(this.el.css('width')) * 2.27;
    this.cHeight = parseInt(this.el.css('font-size'));
    this.colour = (this.config.color)? this.config.color : this.el.css('color');
  
    this.el.css({
      'text-shadow':'none'
    })
  
    this.step = this.cWidth/this.config.intensity;
    this.padding = this.cHeight * 0.2;
    
    this.thickness = (!this.config.thickness)? ~~(this.padding*.8) : this.config.thickness;
    
    this.canvas = this.buildCanvas();
  
    this.buildSpline();
    this.spline.draw(this.ctx,this.colour,this.thickness);
  
  
    this.addSquiggle();
  }
  
  Plugin.prototype.buildCanvas = function(){
  
    var canvas = document.createElement( 'canvas' );
    canvas.width = this.cWidth; canvas.height = this.cHeight;
    // document.body.appendChild( canvas );
    this.ctx = canvas.getContext( '2d' );
    return canvas
  
  }
  Plugin.prototype.Vector = function(opt){
  
    var defaults = {
      x:0,
      y:0
    }
    var obj = $.extend(defaults,opt);
    
    return obj
  }
  Plugin.prototype.buildSpline = function(){
  
    var firstY;
  
    for(var i=0;i<=this.config.intensity;i++){
  
      var ry = this.padding + Math.random()*(this.cHeight - this.padding*1.5);
  
      if(i == 0)firstY = ry;
      if(i == this.config.intensity)ry = firstY;
  
      var vector = this.Vector({
        x:this.step * i,
        y:ry
      })
  
      this.points[i] = vector;
    }
  
    this.spline = new Spline({points:this.points});
  
  }
  
  Plugin.prototype.addSquiggle = function(){
  
    this.bg = this.convertCanvasToImage(this.canvas);
  
    this.el.css({
      'display':'inline',
      'background':'url('+ this.bg +') repeat-x'
    })
  
  }
  Plugin.prototype.showSquiggle = function(){
    this.el.css({
      'display':'inline',
      'background':'url('+ this.bg +') repeat-x'
    })
  }
  Plugin.prototype.hideSquiggle = function(){
    this.el.css({
      'background':'transparent'
    })
  }
  Plugin.prototype.convertCanvasToImage = function(canvas) {
    
    var image = new Image();
    image.src = canvas.toDataURL("image/png");
    
    return image.src;
  }
*/

//  })(jQuery);
