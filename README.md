TURNBOX.js
==========

Flat design UI to perform 3D animation.  
JQuery plugin that can be implemented easily.

[**NOHT CO.,LTD.**][NOHT CO.,LTD.]


Set up
======

We use jQuery.  
Load turnBox.js after loading jquery.js.
          

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
        <script type="text/javascript" src="/js/turnBox.js"></script>

HTML
====

Create a child element for each screen you wish to generate, directly below the element where you want to call turnBox.js.  
Minimum 2, maximum 4. If there are 5 or more child elements, they will be deleted.

  
        <div class="sample">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>

JS
==

When the .turnBox() method is applied to a target element, it will generate it with default values.  
Check the "Defaults and options" section to see which parameters can be changed.
          

        $(".sample").turnBox();  

Defaults and options
====================

        // Defaults //  

        $(".sample").turnBox({  
          width: 200,  
          height: 50,  
          axis: "X",  
          even:,  
          perspective: 800,  
          duration: 200,  
          delay: 0,  
          easing: "linear",  
          direction: "positive",  
          type: "real"  
        });  

- width: Width of box.  
- height: Height of box.  
- axis: Sets rotation axis. "X" for vertical rotation, "Y" for horizontal rotation.  
- even: Length of even-numbered screens.  
- axis: Set to "X" for vertical width, "Y" for horizontal width. If not set, both will be equal.  
- perspective: Intensity of perspective.  
- duration: Duration of animation.  
- delay: Delay time before animation starts.  
- easing: Pace of animation. When easing is set using a transition-timing-function, bezier curves can be entered.  
- direction: Direction of rotation. "negative" will reverse the rotation.  
- type: The following three types of rotation animation can be selected:  


        "real"
        Rotates the screen 90° at a time like an actual box.  
        Can be set to even.

        "repeat"
        Will repeat the animated movement of screens 1 and 2 for screens 3 and 4.  
        Can be set to even.

        "skip"
        Will cancel the display of a passing screen, and rotate the animation 90°relative to the designated screen.  
        A screen can be designated using "turnBoxButtonTo" on the turnBoxButton.



turnBoxButton
=============

By adding a "turnBoxButton" class to the child element of a screen,  
you can set a trigger for box rotation.

By default, an animation is set for the next screen. However,  
by adding "turnBoxButtonPrev" to the class, you can change this to the previous screen.

By default, the turnBoxButton event is set to "click",  
but this can be changed by adding the following class.  
The character strings after "turnboxButtonEvent" correspond to the jQuery event name.


- "turnBoxButtonEventClick"  
- "turnBoxButtonEventMouseover"  
- "turnBoxButtonEventMouseup"  
- "turnBoxButtonEventMousedown"  
- "turnBoxButtonEventMousemove"  
- "turnBoxButtonEventMouseout"  
- "turnBoxButtonEventTouchstart"  
- "turnBoxButtonEventTouchmove"  
- "turnBoxButtonEventTouchend"  


For boxes which are set to type: "skip", using the "turnBoxButtonTo" class  
and adding the number of the screen to be animated will cancel the display of a passing screen,  
and result in a 90° rotation of the designated screen.
          

        <div class="sample">
          <div>
            <p class="turnBoxButton">NEXT</p>
          </div>
          <div>
            <span class="turnBoxButton turnBoxButtonPrev">PREV</span>
            <span class="turnBoxButton">NEXT</span>
          </div>
          <div>
            <span class="turnBoxButton turnBoxButtonEventMouseover turnBoxButtonEventTouchstart">NEXT</span>
          </div>
          <div>
            <span class="turnBoxButton turnBoxButtonTo1">skip to 1</span>
            <span class="turnBoxButton turnBoxButtonTo2">skip to 2</span>
            <span class="turnBoxButton turnBoxButtonTo3">skip to 3</span>
          </div>
        </div>
          

        
CSS
==============

By applying CSS, you can use a class that is set by .turnBox() in addition to the preset id class.  
This designates the numerical value of the screen following "turnBoxFaceNum".


        <style>

          .turnBoxButton {
            line-height: 2.5;
            display: block;
            text-align: center;
          }

          #css-sample-front {
            background: red;
          }

          .turnBoxFaceNum2 {
            background: blue;
          }

          .turnBoxFaceNum3 {
            background: green;
          }

          .turnBoxFaceNum4 {
            background: gray;
          }
          
        </style>

        <div class="css-sample">
          <div id="css-sample-front">
            <p class="turnBoxButton">NEXT</p>
          </div>
            <p class="turnBoxButton">NEXT</p>
          </div>
            <p class="turnBoxButton">NEXT</p>
          </div>
            <p class="turnBoxButton">NEXT</p>
          </div>
        </div>

        <script type="text/javascript">

          $(".css-sample").turnBox();

        </script>


turnBoxLink
===========

The .turnBoxLink() method is used to start an animation from outside the box,  
by using the designated element as a button.  
In a similar manner, an external box can be operated by creating another box inside the first box.  

Defaults and options
--------------------
          


        // Defaults //

        $(".link-sample").turnBoxLink({
          box: ,
          events: "click",
          dist: "next"
        });
          

        
box: Selects the box to be animated.  
events: JQuery event. You can set plural events by delimiting them by spaces.  
dist: Setting this to "prev" will use an animation to move to the previous screen. When the box is type: "skip", entering the screen number will use an animation to move to the desired screen.  
          
    
        <div class="link-sample">
          <div>
            <p class="turnBoxButton">NEXT</p>
          </div>
          <div>
            <div class="child-box">
              <div>
                <p class="turnBoxButton">NEXT</p>
              </div>
              <div>
                <span class="link-button-inner">LINK</span>
              </div>
            </div>
          </div>
          <div>
            <span class="turnBoxButton turnBoxButtonPrev">PREV</span>
          </div>
          <div>
          </div>
        </div>

        <span class="link-button-prev">PREV</span>
        <span class="link-button-next">NEXT</span>
        <span class="link-button-skip">skip to 2</span>

        <script type="text/javascript">

          $(".link-sample").turnBox({
            height: 60,
            type: "skip"
          });

          $(".child-box").turnBox({
            width: 80,
            height: 40 
          });

          $(".link-button-inner").turnBoxLink({
            box: ".link-sample"
          });

          $(".link-button-prev").turnBoxLink({
            box: ".link-sample",
            dist:  "prev"
          });

          $(".link-button-next").turnBoxLink({
            box: ".link-sample"
          });

          $(".link-button-skip").turnBoxLink({
            box: ".link-sample",
            events: "mouseover touchstart",
            dist: 2
          });

        </script>



        
turnBoxAnimate
==============

When you want to initialize a box, or change the surface of a box by linking  
it to another JavaScript function, use the .turnBoxAnimate() function on the target box.

Defaults and options
--------------------


        // Defaults //

        $(".animate-sample").turnBoxAnimate({
          face: 1,
          animation: true
        });
          

        
face: designates the numerical value of the face before it is moved.  
animation: set to false to disable animations at rotation time.  
Assuming that the target box does not have the value type: "skip", this will be set to false if the current face and the designated face are not connected.  
          

        <div class="container">
          <div class="animate-sample">
            <div>
              <span>1:</span>
              <p class="turnBoxButton">NEXT</p>
            </div>
            <div>
              <span>2:</span>
              <p class="turnBoxButton">NEXT</p>
            </div>
            <div>
              <span>3:</span>
              <p class="turnBoxButton">NEXT</p>
            </div>
            <div>
              <span>4:</span>
              <p class="turnBoxButton">NEXT</p>
            </div>
          </div>
          <div class="animate-sample">
            <div>
              <span>1:</span>
              <p class="turnBoxButton">NEXT</p>
            </div>
            <div>
              <span>2:</span>
              <p class="turnBoxButton">NEXT</p>
            </div>
            <div>
              <span>3:</span>
              <p class="turnBoxButton">NEXT</p>
            </div>
            <div>
              <span>4:</span>
              <p class="turnBoxButton">NEXT</p>
            </div>
          </div>
          <div class="animate-sample">
            <div>
              <span>1:</span>
              <p class="turnBoxButton">NEXT</p>
            </div>
            <div>
              <span>2:</span>
              <p class="turnBoxButton">NEXT</p>
            </div>
            <div>
              <span>3:</span>
              <p class="turnBoxButton">NEXT</p>
            </div>
            <div>
              <span>4:</span>
              <p class="turnBoxButton">NEXT</p>
            </div>
          </div>
        </div>

        <span class="animate-true">ANIMATION</span>
        <span class="animate-false">NOT-ANIMATION</span>

        <script type="text/javascript">

        $(".animate-sample").turnBox({
          height: 60,
          type: "skip"
        });

        $(".animate-true").on("click", function()
        {
          $(".animate-sample").turnBoxAnimate();
        });

        $(".animate-false").on("click", function()
        {
          $(".animate-sample").turnBoxAnimate(
          {
           animation: false
          });
        });

        </script>

        
Browser support
===============

We have confirmed compatibility with the following browsers.  

- Google Chrome  
- Firefox  
- Safari  
- Opera  
- Internet Explorer 10+  

Author
======

Yuhei Yamamori

License
=======

[**TURNBOX.js**][TURNBOX.js] is lisenced under [the MIT License (MIT)][MIT_license].  

[NOHT CO.,LTD.]: http://www.noht.co.jp "NOHT CO.,LTD."  
[TURNBOX.js]: http://www.noht.co.jp/turnbox "TURNBOX.js"  
[MIT_license]: http://opensource.org/licenses/MIT "MIT_license"  