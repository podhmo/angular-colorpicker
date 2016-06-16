/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Color Picker
*
* File:        angular-colorpicker-dr.js
* Version:     0.1.0
*
* Author:      Daniel Reznick
* Info:        https://github.com/vedmack/angular-colorpicker
* Contact:     vedmack@gmail.com
* Twitter:	   @danielreznick
* Q&A		   http://stackoverflow.com
*
* Copyright 2015 Daniel Reznick, all rights reserved.
* Copyright 2015 Released under the MIT License
*
* This source file is distributed in the hope that it will be useful, but
* WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
* or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
*/
(function () {
  'use strict';
  function previous(elem) {
    if (elem.previousElementSibling) {
      return elem.previousElementSibling;
    }
    while (elem = elem.previousSibling) {
      if (elem.nodeType === 1) {
        return elem;
      }
    }
  }
  function closest(elem, cls) {
    var found = false;
    while (elem.parent() !== undefined && found === false) {
      if (elem.parent().hasClass(cls)) {
        found = true;
      }
      elem = elem.parent();
    }
    return elem;
  }

  function getRect(e) {
    var rect = e.getBoundingClientRect();
    return {height: rect.height, top: rect.top, left: rect.left};
  }


  function DriverInit($el, $window, scope){
    this.$el = $el;
    this.$window = $window;
    this.scope = scope;
    return this;
  }

  function DriverMutator($compile, $window, scope){
    this.$compile = $compile;
    this.$window = $window;
    this.scope = scope;
  }

  DriverMutator.prototype.append = function(srcDriver, targetDriver){
    srcDriver.$el.append(targetDriver.$el);
  };
  DriverMutator.prototype.replaceWith = function(srcDriver, targetDriver){
    srcDriver.$el.replaceWith(targetDriver.$el);
  };
  DriverMutator.prototype.fromTemplate = function(FN, template){
    var el = this.$compile(template)(this.scope);
    return this.fromElement(FN, el);
  };
  DriverMutator.prototype.fromElement = function(FN, el){
    return new FN().init(el, this.$window, this.scope);
  };

  function Driver(){
  }
  Driver.prototype.init = DriverInit;
  Driver.prototype.bindClick = function click(pd){
    this.$el.bind("click", function (ev) {
      //show color picker beneath the input
      var rect = getRect(ev.target);
      var top = rect.top + this.$window.pageYOffset;
      pd.activate(top, rect.left, rect.height);
      ev.stopPropagation();
    }.bind(this));
  };
  Driver.prototype.syncColor = function syncColor(color){
    if (this.scope.colorMe !== undefined && this.scope.colorMe === 'true') {
      this.$el[0].style.backgroundColor = color;
    } else {
      this.$el.val(color);
    }
  };

  function BodyDriver(){
  }
  BodyDriver.prototype.init = DriverInit;
  BodyDriver.prototype.bindClick = function click(){
    //when clicking somewhere on the screen / body -> hide the color picker
    this.$el.bind("click", function () {
      var i,
          docChildren = this.$el.children();
      for (i = 0; i < docChildren.length; i++) {
        if (docChildren[i].className.indexOf('color-picker-wrapper body') !== -1) {
          angular.element(docChildren[i]).addClass('hide');
        }
      }
    }.bind(this));
  };

  function PickerDriver(){
  }
  PickerDriver.prototype.init = DriverInit;
  PickerDriver.prototype.bindClick = function click(ngModel, d){
    // TODO: remove element;
    this.$el.find('cp-color').on('click', function (ev) {
      var color = angular.element(ev.target).attr('color');
      ngModel.$setViewValue(color);
      d.syncColor(color);
    }.bind(this));
  };
  function TPickerDriver(){
  }
  TPickerDriver.prototype.init = DriverInit;
  TPickerDriver.prototype.bindClick = function click(ngModel, stop){
    this.$el.find('cp-color').on('click', function (ev) {
      ngModel.$setViewValue(angular.element(ev.target).attr('color'));
      if(stop){
        ev.stopPropagation();
      }
    });
  };
  TPickerDriver.prototype.activate = function activate(top, left, height){
    this.$el.removeClass('hide');
    this.$el[0].style.top = top + height + 'px';
    this.$el[0].style.left = left + 'px';
  };

  function TTriggerDriver(){
  }
  TTriggerDriver.prototype.init = DriverInit;
  TTriggerDriver.prototype.bindClick = function click(pd) {
    this.$el.bind("click", function (ev) {
      var wrapper = closest(angular.element(ev.target), 'color-picker-wrapper'),
          rect = getRect(wrapper[0]);
      var top = rect.top + this.$window.pageYOffset;
      pd.activate(top, rect.left, rect.height);
      ev.stopPropagation();
    }.bind(this));
  };
  function TriggerDriver(){
  }
  TriggerDriver.prototype.init = DriverInit;
  TriggerDriver.prototype.bindClick = function click(pd) {
    this.$el.bind("click", function (ev) {
      //show color picker beneath the input
      var $wrapper = closest(angular.element(ev.target), 'color-picker-wrapper'),
          wrapperPrev = previous($wrapper[0]),
          rect = getRect(wrapperPrev);
      var top = rect.top + this.$window.pageYOffset;
      pd.activate(top, rect.left, rect.height);
      ev.stopPropagation();
    }.bind(this));
  };

  var cpTemplate = '<div class="color-picker-row-wrapper">' +
      '<div class="color-picker-row">' +
      '<cp-color class="color-picker navy" color="#001F3F">' +
      '</cp-color>' +
      '<cp-color class="color-picker blue" color="#0074D9">' +
      '</cp-color>' +
      '<cp-color class="color-picker aqua" color="#7FDBFF">' +
      '</cp-color>' +
      '<cp-color class="color-picker teal" color="#39CCCC">' +
      '</cp-color>' +
      '</div>' +
      '</div>' +
      '<div class="color-picker-row-wrapper">' +
      '<div class="color-picker-row">' +
      '<cp-color class="color-picker olive" color="#3D9970">' +
      '</cp-color>' +
      '<cp-color class="color-picker green" color="#2ECC40">' +
      '</cp-color>' +
      '<cp-color class="color-picker lime" color="#01FF70">' +
      '</cp-color>' +
      '<cp-color class="color-picker yellow" color="#FFDC00">' +
      '</cp-color>' +
      '</div>' +
      '</div>' +
      '<div class="color-picker-row-wrapper">' +
      '<div class="color-picker-row">' +
      '<cp-color class="color-picker orange" color="#FF851B">' +
      '</cp-color>' +
      '<cp-color class="color-picker red" color="#FF4136">' +
      '</cp-color>' +
      '<cp-color class="color-picker maroon" color="#85144B">' +
      '</cp-color>' +
      '<cp-color class="color-picker fuchia" color="#F012BE">' +
      '</cp-color>' +
      '</div>' +
      '</div>' +
      '<div class="color-picker-row-wrapper">' +
      '<div class="color-picker-row">' +
      '<cp-color class="color-picker purple" color="#B10DC9">' +
      '</cp-color>' +
      '<cp-color class="color-picker black" color="#111111">' +
      '</cp-color>' +
      '<cp-color class="color-picker gray" color="#AAAAAA">' +
      '</cp-color>' +
      '<cp-color class="color-picker white" color="#FFFFFF">' +
      '</cp-color>' +
      '</div>' +
      '</div>' +
      '</div>';
  var cpTinyTemplate = '<div class="color-picker-wrapper picker-icon">' +
      '<div class="color-picker-row-wrapper">' +
      '<div class="color-picker-row">' +
      '<cp-color class="color-picker navy">' +
      '</cp-color>' +
      '<cp-color class="color-picker blue">' +
      '</cp-color>' +
      '<cp-color class="color-picker aqua">' +
      '</cp-color>' +
      '<cp-color class="color-picker teal">' +
      '</cp-color>' +
      '</div>' +
      '</div>' +
      '<div class="color-picker-row-wrapper">' +
      '<div class="color-picker-row">' +
      '<cp-color class="color-picker olive">' +
      '</cp-color>' +
      '<cp-color class="color-picker green">' +
      '</cp-color>' +
      '<cp-color class="color-picker lime">' +
      '</cp-color>' +
      '<cp-color class="color-picker yellow">' +
      '</cp-color>' +
      '</div>' +
      '</div>' +
      '<div class="color-picker-row-wrapper">' +
      '<div class="color-picker-row">' +
      '<cp-color class="color-picker orange">' +
      '</cp-color>' +
      '<cp-color class="color-picker red">' +
      '</cp-color>' +
      '<cp-color class="color-picker maroon">' +
      '</cp-color>' +
      '<cp-color class="color-picker fuchia">' +
      '</cp-color>' +
      '</div>' +
      '</div>' +
      '<div class="color-picker-row-wrapper">' +
      '<div class="color-picker-row">' +
      '<cp-color class="color-picker purple">' +
      '</cp-color>' +
      '<cp-color class="color-picker black">' +
      '</cp-color>' +
      '<cp-color class="color-picker gray">' +
      '</cp-color>' +
      '<cp-color class="color-picker white">' +
      '</cp-color>' +
      '</div>' +
      '</div>' +
      '</div>';

  var directive = function ($compile, $document, $window) {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        changeColor: "&",
        tinyTrigger: "@",
        colorMe: "@",
        ngModel : '='
      },

      link: function (scope, element, attrs, ngModel) {
        var content,
            templateHidden = '<div class="color-picker-wrapper body hide">',
            templateInline = '<div class="color-picker-wrapper">',
            template = cpTemplate,
            templateTinyTrigger = cpTinyTemplate;
        var mutator = new DriverMutator($compile, $window, scope);
        var d = new Driver().init(element, $window, scope);
        var pd,td;
        var bd = mutator.fromElement(BodyDriver, angular.element(document.body));
        if (scope.tinyTrigger !== undefined && scope.tinyTrigger === 'true') {
          templateTinyTrigger = templateTinyTrigger.replace('picker-icon', 'picker-icon trigger');
          td = mutator.fromTemplate(TTriggerDriver, templateTinyTrigger);
          mutator.replaceWith(d, td);

          template = templateHidden + template;
          pd = mutator.fromElement(TPickerDriver, angular.element(template));
          pd.bindClick(ngModel, false);
          mutator.append(bd, pd);
          td.bindClick(pd);
        } else {
          if (element[0].tagName === 'INPUT') {

            template = templateHidden + template;
            pd = mutator.fromElement(PickerDriver, angular.element(template));
            pd.bindClick(ngModel, d);
            mutator.append(bd, pd);
            d.bindClick(pd);

            // element tiny trigger
            td = mutator.fromTemplate(TriggerDriver, templateTinyTrigger);
            mutator.append(d, td);
            td.bindClick();
            $compile(content)(scope);
          } else {
            //replace element with the color picker
            template = templateInline + template;
            mutator.fromElement(TPickerDriver, angular.element(template));
            mutator.replaceWith(d, pd);
            pd.bindClick(ngModel, true);
          }
        }
        bd.bindClick();
      }
    };
  };
  directive.$inject = ["$compile","$document", "$window"];
  angular.module('colorpicker-dr', []).directive('colorPicker', directive);
}());
