(function($){
  $.fn.turnBox = function(options)
  {
    var defaults = {
      width: 200,
      height: 50,
      axis: "X",
      perspective: 800,
      duration: 200,
      delay: 0,
      easing: "linear",
      direction: "positive",
      type: "real",
    };

    var setting = $.extend(defaults, options);
    var
    box = this,
    width = setting.width,
    height = setting.height,
    even = setting.even,
    perspective = setting.perspective,
    duration = setting.duration,
    easing = setting.easing,
    delay = setting.delay,
    type = setting.type,
    axis = setting.axis.toUpperCase(),
    direction = setting.direction,
    face_pcs = box.children().length;

    if(face_pcs > 4) {
      var face_pcs = 4;
    }

    if(axis == "Y") {
      var length = width; 
    } else {
      var length = height; 
    }

    if(even == undefined) {
      var even = length;
    }

    if(length !== even) {
      var fixed = false;
      if(type == "skip") {
        var type = "real";    
      }
    } else {
      var fixed = true;
    }

    if(type !== "repeat" && type !== "skip") {
      var type = "real";
    }

    if(direction !== "negative") {
      var direction = "positive";
    }

    // styleをheaderにappend
    function append_styles(box, css_code)
    {
      var box_name = encode_class_id(box.selector);

      var style_id = "turnBoxStyle-" + box_name;
      var css_template = '<style id="%style_id%">\n%css_code%\n</style>';

      var style = css_template.replace(/%style_id%/g, style_id);
      style = style.replace(/%css_code%/g, css_code);

    if(document.getElementById(style_id) != null) {
      $("#" + style_id).remove();
    }

      $("head").append(style);
    }

    //-----------------------------------------------
    // cssコードの取得
    //-----------------------------------------------
    // prefix
    function get_prefix()
    {
      var prefix = ["-webkit-", "-moz-", "-ms-", "-o-", ""];

      return prefix;
    }

    // perspective
    function get_perspective_code()
    {
      var prefix = get_prefix();
      var pespective = "";
   
      $.each(prefix, function()
      {
        pespective = pespective + " " + this + "perspective: " + perspective + "px;\n";
      });
      
      return pespective;
    }

    // transition
    function get_transition_code(target)
    {
      var prefix = get_prefix();
      var transition = "";
      
      $.each(prefix, function()
      {
        if(target == "each_face") {
          var property = [ this + "transform", "z-index", "background"];
        } else if(target == "background"){
          var property = ["background"];
        } else {
          var property = ["all"];
        }
        var each_transition = "";

        $.each(property, function(key)
        {
          var comma = ", ";
          if(this == property[0]) {
            var comma = "";
          }
          each_transition = each_transition + comma + this + " " + duration + "ms " + easing + " " + delay + "ms";
        });


        transition = transition + " " + this + "transition: " + each_transition + ";\n";
      });
      
      return transition;
    }

    // transform-origin
    function get_transform_origin_code(val)
    {
      var prefix = get_prefix();
      var transform_origin = "";
   
      $.each(prefix, function()
      {
        transform_origin = transform_origin + " " + this + "transform-origin: " + val + ";\n";
      });
      
      return transform_origin;
    }

    // transform
    // translate3dは関数から取得する。
    function get_transform_code(deg, num, adjust)
    {
      if(adjust !== undefined) {
        var translate3d = get_adjust_translate3d_code(deg, num);
      } else if(fixed == false) {
        var translate3d = get_variable_translate3d_code(deg, num);
      } else {
        var translate3d = get_fixed_translate3d_code(deg);
      }

      var prefix = get_prefix();
      var transform = "";
    
      $.each(prefix, function()
      {
        transform = transform + " " + this + "transform: rotate" + axis + "(" + deg + "deg) translate3d(" + translate3d + ");\n";
      });
      
      return transform;
    }

    // translate3d: 固定幅
    function get_fixed_translate3d_code(deg)
    {
      var change_length = length;

      if(deg < 0) {
        change_length = -length;
      }
      if(deg == 0 || deg == 360 || deg == -360) {
        var translate3d = "0px, 0px, 0px";
      }
      if(axis == "Y") { 
        if(deg == 90 || deg == -90) {
          var translate3d = change_length/2 + "px, 0px, " + length/2 + "px";
        } else if(deg == 180 || deg == -180) {
          var translate3d = "0px, 0px, " + length + "px";
        } else if(deg == 270 || deg == -270) {
          var translate3d = change_length/2 + "px, 0px, " + length/2 + "px";
        }
      } else {
        if(deg == 90 || deg == -90) {
          var translate3d = "0px, " + -change_length/2 + "px, " + length/2 + "px";
        } else if(deg == 180 || deg == -180) {
          var translate3d = "0px, 0px, " + length + "px";
        } else if(deg == 270 || deg == -270) {
          var translate3d = "0px, " + change_length/2 + "px, " + length/2 + "px";
        }
      }

      return translate3d;
    }

    // translate3d: even可変
    function get_variable_translate3d_code(deg, num)
    {
      var change_length = length;

      if(deg < 0) {
        change_length = length * -1;
      }
      if(deg == 0 || deg == 360 || deg == -360) {
        var translate3d = "0px, 0px, 0px";
      }
      if(axis == "Y") {
        if(num == 1 || num == 3 || num == 5) {
          if(deg == 90 || deg == -270) {
            var translate3d = even + "px, 0px, 0px";
          } else if(deg == 180 || deg == -180) {
            var translate3d = (even * 2 - length) + "px, 0px, " + even + "px";
          } else if( deg == 270 || deg == -90 ) {
            var translate3d = (even - length) + "px, 0px, " + even + "px";
          }
        }
        if(num == 0 || num == 2 || num == 4) {
          if(deg == 90 || deg == -270) {
            var translate3d = even + "px, 0px, " + -(even - length) + "px";
          } else if(deg == 180 || deg == -180) {
            var translate3d = even + "px, 0px, " + length + "px";
          } else if(deg == 270 || deg == -90) {
            var translate3d = "0px, 0px, " + even + "px";
          }
        }
      } else {
        if(num == 1 || num == 3 || num == 5) {
          if(deg == 90 || deg == -270) {
            var translate3d = "0px, " + (even - length) + "px, " + even + "px";
          } else if(deg == 180 || deg == -180) {
            var translate3d = "0px, " + (even * 2 - length) + "px, " + even + "px";
          } else if( deg == 270 || deg == -90 ) {
            var translate3d = "0px, " + even + "px, 0px";
          }
        }
        if(num == 0 || num == 2 || num == 4) {
          if(deg == 90 || deg == -270) {
            var translate3d = "0px, 0px, " + even + "px";
          } else if(deg == 180 || deg == -180) {
            var translate3d = "0px, " + even + "px, " + length + "px";
          } else if(deg == 270 || deg == -90) {
            var translate3d = "0px, " + even + "px, " + -(even - length) + "px";
          }
        }
      }

      return translate3d;
    }

    // translate3d: even可変・回転調整用
    function get_adjust_translate3d_code(deg, num)
    {
      var change_length = length;

      if(deg < 0) {
        change_length = length * -1;
      }
      if(deg == 0 || deg == 360 || deg == -360) {
        var translate3d = "0px, 0px, 0px";
      }
      if(axis == "Y") {
        if(num == 1 || num == 3 || num == 5) {
          if(deg == 90 || deg == -270) {
            var translate3d = "0px, 0px, " + even + "px";
          } else if(deg == 180 || deg == -180) {
            var translate3d = -length + "px, 0px, " + even + "px";
          } else if( deg == 270 || deg == -90 ) {
            var translate3d = -length + "px, 0px, 0px";
          }
        }
        if(num == 0 || num == 2 || num == 4) {
          if(deg == 90 || deg == -270) {
            var translate3d = "0px, 0px, " + length + "px";
          } else if(deg == 180 || deg == -180) {
            var translate3d = -even + "px, 0px, " + length + "px";
          } else if(deg == 270 || deg == -90) {
            var translate3d = -even + "px, 0px, 0px";
          }
        }
      } else {
        if(num == 1 || num == 3 || num == 5) {
          if(deg == 90 || deg == -270) {
            var translate3d = "0px, " + -length + "px, 0px";
          } else if(deg == 180 || deg == -180) {
            var translate3d = "0px, " + -length + "px, " + even + "px";
          } else if( deg == 270 || deg == -90 ) {
            var translate3d = "0px, 0px, " + even + "px";
          }
        }
        if(num == 0 || num == 2 || num == 4) {
          if(deg == 90 || deg == -270) {
            var translate3d = "0px, " + -even + "px, 0px";
          } else if(deg == 180 || deg == -180) {
            var translate3d = "0px, " + -even + "px, " + length + "px";
          } else if(deg == 270 || deg == -90) {
            var translate3d = "0px, 0px, " + length + "px";
          }
        }
      }

      return translate3d;
    }

    // htmlの設定
    function set_box()
    {
      var box_name = encode_class_id(box.selector);

      $.each(box, function()
      {
        var box = $(this);
        var type_class = encode_upper_case(type);
        var direction_class = encode_upper_case(direction);

        if(box.hasClass("turnBoxContainer") == true) {
          return false;
        }

        box.children(":gt(3)").remove();

        box.addClass("turnBoxContainer  turnBoxName-" + box_name + " turnBoxType" + type_class + " turnBoxDirection" + direction_class + " turnBoxCurrentFace1");

        for(i = 0; i < face_pcs; i++) {
          var box_num = i + 1;
          var each_face = $(box.children()[i]);

          each_face.addClass("turnBoxFace turnBoxFaceNum" + box_num);
          if(box_num == 1) {
            each_face.addClass("turnBoxShow");
          }
        }
      });
    }

    // ボタンの設定
    function setting_button()
    {
      var button = $(box).find(".turnBoxButton");
      var encode_box_name = encode_class_id($(box).selector);
      var encode_button_class = "turnBoxButtonFor-" + encode_box_name;

      if(button.attr("class") !== undefined) {
        $.each(button, function()
        {
          var button = $(this);
          
          if(button.attr("class").indexOf("turnBoxButtonFor-") > -1) {
            var reg = new RegExp("(turnBoxButtonFor-)([^ ]*)", "gi");
            var has_class = reg.exec(button.attr("class"));
            var closest_box = slice_class(button.closest(".turnBoxContainer"), "turnBoxName-");

            if(closest_box == encode_box_name) {
              button.removeClass(has_class[0]);
              button.addClass(encode_button_class);
            }
          } else {
            button.addClass(encode_button_class);
          }
        });

        return encode_button_class;
      }
    }

    // css生成
    function create_style()
    {
      var box_name = box.selector;
      var min_i = 1;
      if(face_pcs == 4) {
        face_pcs = 6;
        var min_i = 0;
      } else {
        face_pcs = face_pcs + 1;
      }

      if(axis == "Y") {
        var length_property = "width"; 
        var length = width; 
      } else {
        var length_property = "height";
        var length = height; 
      }

      var adjust_transform_origin = "";

      if(fixed == false) {
        if(axis == "Y") {
          var transform_origin = even + "px 50%";
          var adjust_space = " left: " + -(even - length)/2 + "px;\n";
          var adjust_transform_origin = 
          "\n" + box_name + ".turnBoxAdjust > .turnBoxFace {\n"
          + get_transform_origin_code("0px 50%") +
          "}\n";
        } else {
          var transform_origin = "50% " + even + "px";
          var adjust_space = " height: " + even + "px;\n";
          var adjust_transform_origin = 
          "\n" + box_name + ".turnBoxAdjust > .turnBoxFace {\n"
          + get_transform_origin_code("50% 0px") +
          "}\n";
        }

        var even_style = 
        box_name + ".turnBoxCurrentFace0, " + box_name + ".turnBoxCurrentFace2, " + box_name + ".turnBoxCurrentFace4 {\n" +
        adjust_space +
        "}\n" +
        "\n" + box_name + " > .turnBoxFaceNum1, " + box_name + " > .turnBoxFaceNum3, " + box_name + " > .turnBoxFaceNum5 {\n" +
        " " + length_property + ": " + length + "px;\n" +
        "}\n" +
        "\n" + box_name + " > .turnBoxFaceNum0, " + box_name + " > .turnBoxFaceNum2, " + box_name + " > .turnBoxFaceNum4 {\n" +
        " " + length_property + ": " + even + "px;\n" +
        "}\n";
      } else {
        var even_style = "";
        var transform_origin = "50% 50%";
      }

      var box_style = 
      box_name + " {\n" +
      get_transition_code("box") +
      get_perspective_code() + 
      " display: block;\n" +
      " position: relative;\n" +
      " width: " + width + "px;\n" +
      " height: " + height + "px;\n" +
      " left: 0;\n" +
      "}\n" +
      adjust_transform_origin;

      var face_style = 
      box_name + " > .turnBoxFace {\n" +
      get_transform_origin_code(transform_origin) +
      " position: absolute;\n" +
      " width: 100%;\n" +
      " height: 100%;\n" +
      " top: 0;\n" +
      " left: 0;\n" +
      " opacity: 0;\n" +
      "}\n" +
      "\n" + box_name + " > .turnBoxShow {\n"
      + " opacity: 1;\n" +
      "}\n" +
      "\n" + box_name + " > .turnBoxTransition {\n" +
      get_transition_code("each_face") +
      "}\n";

      var each_face_style = "";
      var adjust_style = "";

      for(i = min_i; i < face_pcs; i++) {
        var box_num = i;
        var current_box = box_name + ".turnBoxCurrentFace" + box_num;

        $.each(box, function()
        {
          face_arry = $(this).children(".turnBoxFace");
        });

        $.each(face_arry, function(key)
        {
          var num = key + 1;

          var deg = (box_num - num) * -90;

          if(type == "skip") {
            if(deg == 0) {
              var deg = 0;
            } else if(deg < 0) {
              var deg = -90;
            } else if(deg > 0) {
              var deg = 90;
            }
            if(box_num == 4 && num == 1 || box_num == 1 && num == 4)
            {
              var deg = deg * -1;
            }
          }

          if(type == "repeat") {
            if(box_num == 1 || box_num == 3 || box_num == 5) {
              if(num == 0 || num == 2 || num == 4) {
                var deg = 90;
              }
            }
            if(box_num == 0 || box_num == 2 || box_num == 4) {
              if(num == 1 || num == 3 || num == 5) {
                var deg = -90;
              }
            }
          }

          if(direction == "negative") {
            var deg = deg * -1;
            if(deg == -0) {
              var deg = 0;
            }
          }

          if(deg == 0 || Math.abs(deg) == 360) {
            var z_index = 20;
          } else if(Math.abs(deg) == 90 || Math.abs(deg) == 270) {
            var z_index = 10;
          } else if(Math.abs(deg) == 180) {
            var z_index = 0;
          }

          each_face_style = each_face_style + "\n" +
          current_box + " > .turnBoxFaceNum" + num + " {\n" +
          get_transform_code(deg, num) +
          " z-index: " + z_index + ";\n" +
          "}\n";

          if(fixed == false && type == "real") {
            adjust_style = adjust_style + "\n" +
            current_box + ".turnBoxAdjust > .turnBoxFaceNum" + num + " {\n" +
            get_transform_code(deg, num, true) +
            "}\n";
          }
        });
      }

      var general_style = 
      box_style + "\n" + 
      face_style + "\n" +
      even_style + "\n" + 
      each_face_style + "\n" + 
      adjust_style;

      append_styles(box, general_style);
    }

    set_box();
    create_style();
    setting_button();

    var button = $(box).find(".turnBoxButtonFor-" + encode_class_id($(box).selector));

    init_click(box, button, duration, delay, type, face_pcs, fixed, direction, false);
  }

  $.fn.turnBoxLink = function(options)
  {
    var box = $(options.box);
    var button = this;
    var box_val = get_box_val(box);
    var link_events = options.events;
    var link_dist = options.dist;

    if(link_events == undefined) {
      var link_events = "click";
    }
    if(link_dist == undefined) {
      var link_dist = "next";
    }

    var link = {
      events: link_events,
      dist: link_dist
    };

    init_click(box, button, box_val.duration, box_val.delay, box_val.type, box_val.face_pcs, box_val.fixed, box_val.direction, link);
  }

  $.fn.turnBoxAnimate = function(options)
  {
    var defaults = {
      animation: true,
      face: 1
    };

    var box = $(this);

    $.each(box, function()
    {      
      var target_box = $(this);
      var box_val = get_box_val(target_box);
      var setting = $.extend(defaults, options);

      if(setting.face > box_val.face_pcs) {
        var target_num = box_val.face_pcs;
      } else {
        var target_num = setting.face;
      }

      var deff = Math.abs(target_num - box_val.current_num);
      var animation = setting.animation;

      if(box_val.type !== "skip" && deff > 1) {
        var animation = false;
      }

      animate_box(target_box, box_val.current_num, target_num, box_val.duration, box_val.delay, box_val.type, box_val.face_pcs, box_val.fixed, box_val.direction, animation);
    });
  }

  function get_box_val(box)
  {
    var type = slice_class(box, "turnBoxType");
    var type = decode_upper_case(type);
    var direction = slice_class(box, "turnBoxDirection");
    var direction = decode_upper_case(direction);
    var face_1_height = box.children(".turnBoxFaceNum1").css("height");
    var face_2_height = box.children(".turnBoxFaceNum2").css("height");
    var face_1_width = box.children(".turnBoxFaceNum1").css("width");
    var face_2_width = box.children(".turnBoxFaceNum2").css("width");

    if(face_1_height == face_2_height && face_1_width == face_2_width) {
      var fixed = true;
    } else if(face_1_height !== face_2_height || face_1_width !== face_2_width) {
      var fixed = false;
    }

    var box_val = {
      face_pcs: box.children().length,
      current_num: parseInt(slice_class(box, "turnBoxCurrentFace")),
      duration: parseFloat(box.css("transition-duration")) * 1000,
      delay: parseFloat(box.css("transition-delay")) * 1000,
      type: type,
      fixed: fixed,
      direction: direction
    };
    return box_val;
  }

  function encode_class_id(name)
  {
    var new_name = name;
    var new_name = new_name.replace(/ \./g, "--");
    var new_name = new_name.replace(/ \#/g, "-_");
    var new_name = new_name.replace(/ /g, "");
    var new_name = new_name.replace(/\./g, "-");
    var new_name = new_name.replace(/\#/g, "_");

    return new_name;
  }

  function slice_class(target, text)
  {
    var target_class = target.attr("class");
    var text_length = text.length;
    var text_start = target_class.indexOf(text);
    var cut_class = target.attr("class").slice(text_start + text_length);
    var find_space = cut_class.indexOf(" ");
    if(find_space !== -1) {
      var sliced_class = cut_class.slice(0, find_space);
    } else {
      var sliced_class = cut_class;
    }

    return sliced_class;
  }

  function encode_upper_case(text)
  {
    var text_head = text.slice(0, 1).toUpperCase(); 
    var text_body = text.slice(1);
    var text = text_head + text_body;

    return text;
  }

  function decode_upper_case(text)
  {
    var text_head = text.slice(0, 1).toLowerCase(); 
    var text_body = text.slice(1);
    var text = text_head + text_body;

    return text;
  }

  function init_click(box, button, duration, delay, type, face_pcs, fixed, direction, link)
  {
    $.each(button, function()
    {
      var button = $(this);
      var button_events = [
        "click",
        "mouseover",
        "mouseup",
        "mousedown",
        "mousemove",
        "mouseout",
        "touchstart",
        "touchmove",
        "touchend"
      ];
      var button_event = "";

      if(link == false) {
        if($(this).attr("class").indexOf("turnBoxButtonEvent") > -1) {
          $.each(button_events, function()
          {
            var each_event = this;

            if(button.attr("class").indexOf("turnBoxButtonEvent" + encode_upper_case(each_event)) > -1) {
              button_event = button_event + " " + each_event;
            } 
          });
        } else {
          button_event = button_event + "click";
        }
      } else {
        button_event = link.events;
      }

      button.on(button_event, function()
      {
        if(button.attr("class").indexOf("turnBoxButtonFor-") > -1) {
          var reg = new RegExp("(turnBoxButtonFor-)([^ ]*)", "gi");
          var sliced_class = reg.exec(button.attr("class"))[2];
        } else {
          var sliced_class = encode_class_id($(box).selector);
        }

        if(link == false) {
          var target_box = $(this).closest(".turnBoxContainer");
        } else {
          var target_box = box;
        }

        var current_num = parseInt(slice_class(target_box, "turnBoxCurrentFace"));

        if(link == false) {
          if(type == "skip" && $(this).attr("class").indexOf("turnBoxButtonTo") > -1) {
            var target_num = parseInt(slice_class($(this), "turnBoxButtonTo"));
          } else if($(this).hasClass("turnBoxButtonPrev") == 1) {
            var target_num = current_num - 1;
          } else {
            var target_num = current_num + 1;
          }
        } else {
          if(type == "skip" && $.isNumeric(link.dist) == true) {
            var target_num = link.dist;
          } else if(link.dist == "prev") {
            var target_num = current_num - 1;
          } else {
            var target_num = current_num + 1;
          }
        }

        if(encode_class_id($(box).selector) == sliced_class || link !== false) {
          animate_box(target_box, current_num, target_num, duration, delay, type, face_pcs, fixed, direction);
        }
      });
    });
  }

  function animate_box(target_box, current_num, target_num, duration, delay, type, face_pcs, fixed, direction, animation)
  {
    if(current_num == target_num) {
      return false;
    }

    var turnBoxAnimation = target_box.children().hasClass("turnBoxTransition");
    var face_pcs = target_box.children().length;
    var time = duration + delay;
    var adjust_time = 20;

    if(type !== "real") {
      if(target_num == 5) {
        target_num = 1;
      }
      if(face_pcs == 4 && target_num == 0) {
        target_num = face_pcs;
      }
    }

    if(face_pcs !== 4 && target_num > face_pcs || face_pcs !== 4 && target_num < 1) {
      return false;
    }

    if(turnBoxAnimation == false || turnBoxAnimation == true && animation !== undefined) {

      if(fixed == false && type == "real") {
        if(direction == "negative") {
          if(current_num == 0 && target_num == 5 ||
            current_num == 1 && target_num == 2 ||
            current_num == 2 && target_num == 1 ||
            current_num == 3 && target_num == 4 ||
            current_num == 4 && target_num == 3 ||
            current_num == 5 && target_num == 0) {
            target_box.addClass("turnBoxAdjust");
          }
        } else {
          if(current_num == 0 && target_num == 1 ||
            current_num == 1 && target_num == 0 ||
            current_num == 2 && target_num == 3 ||
            current_num == 3 && target_num == 2 ||
            current_num == 4 && target_num == 5 ||
            current_num == 5 && target_num == 4) {
            target_box.addClass("turnBoxAdjust");
          }
        }
        setTimeout(function()
        {
          target_box.removeClass("turnBoxAdjust");
        }, time + adjust_time + 20);
      }

      setTimeout(function()
      {
        var current_box_class = "turnBoxCurrentFace" + current_num.toFixed();
        var target_box_class = "turnBoxCurrentFace" + target_num.toFixed();
        var current_face_class = "turnBoxFaceNum" + current_num.toFixed();
        var target_face_class = "turnBoxFaceNum" + target_num.toFixed();

        if(target_num == 0) {
          var current_face_class = "turnBoxFaceNum1";
          var target_face_class = "turnBoxFaceNum4";
        }
        if(target_num == 5) {
          var current_face_class = "turnBoxFaceNum4";
          var target_face_class = "turnBoxFaceNum1";
        }

        if(animation == true || animation == undefined) {
          target_box.find(".turnBoxFace").addClass("turnBoxTransition");
        }
        target_box.children("." + target_face_class).addClass("turnBoxShow");
        target_box.addClass(target_box_class).removeClass(current_box_class);

        setTimeout(function()
        {
          target_box.find(".turnBoxFace").removeClass("turnBoxTransition");
          target_box.children("." + current_face_class).removeClass("turnBoxShow");
          if(target_num == 0) {
            target_box.addClass("turnBoxCurrentFace4").removeClass("turnBoxCurrentFace0");
          }
          if(target_num == 5) {
            target_box.addClass("turnBoxCurrentFace1").removeClass("turnBoxCurrentFace5");
          }
        }, time);
      }, adjust_time);
    }
  }
})(jQuery);