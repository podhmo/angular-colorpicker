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
    return e.getBoundingClientRect();
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

  /*
  strtructure
  ----------------------------------------

  ::

    bd[BodyDriver]
      d[Driver] <- replace - td[TriggerDriver, button]

      pd[PickerDriver, modal dialog]

  */

  function Driver(){
  }
  Driver.prototype.init = DriverInit;
  Driver.prototype.bindAction = function action(typ, pd){
    this.$el.bind(typ, function (ev) {
      var rect = getRect(ev.target);
      var top = rect.top + this.$window.pageYOffset;

      pd.show(top, rect.left, rect.height);
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
  BodyDriver.prototype.bindAction = function action(typ){
    this.$el.bind(typ, function () {
      this.hide();
    }.bind(this));
  };
  BodyDriver.prototype.hide = function hide(){
    var i,
        docChildren = this.$el.children();
    for (i = 0; i < docChildren.length; i++) {
      if (docChildren[i].className.indexOf('color-picker-wrapper body') !== -1) {
        angular.element(docChildren[i]).addClass('hide');
      }
    }
  };

  function PickerDriver(){
  }
  PickerDriver.prototype.init = DriverInit;
  // opts = {cont: Function, propagate: boolean}
  PickerDriver.prototype.bindAction = function action(typ, ngModel, opts){
    this.$el.find('cp-color').on(typ, function (ev) {
      var color = angular.element(ev.target).attr('color');
      ngModel.$setViewValue(color);

      if (opts.cont) {
        opts.cont(color);
      }
      if(!opts.propagate){
        ev.stopPropagation();
      }
    });
  };
  PickerDriver.prototype.show = function show(top, left, height){
    this.$el.removeClass('hide');
    this.$el[0].style.top = top + height + 'px';
    this.$el[0].style.left = left + 'px';
  };

  function TriggerDriver(){
  }
  TriggerDriver.prototype.init = DriverInit;

  // opts = {findWrapper: Function}
  TriggerDriver.prototype.bindAction = function action(typ, pd, opts) {
    this.$el.bind(typ, function (ev) {
      var wrapper = angular.element(ev.target);
      if (opts.findWrapper) {
        wrapper = opts.findWrapper(wrapper);
      }
      var rect = getRect(wrapper[0]);
      var top = rect.top + this.$window.pageYOffset;

      pd.show(top, rect.left, rect.height);
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
  var cpTriggerTemplate = '<div class="color-picker-wrapper picker-icon">' +
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

  var TRIGGER_TEMPLATE_NAME = 'template/color-picker-trigger.html',
      TEMPLATE_NAME = 'template/color-picker.html';

  var directive = function ($compile, $document, $window, $templateCache, $templateRequest, $q) {
    $templateCache.put(TRIGGER_TEMPLATE_NAME, cpTriggerTemplate);
    $templateCache.put(TEMPLATE_NAME, cpTemplate);
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        tinyTrigger: "@",
        colorMe: "@",
        ngModel : '='
      },

      link: function (scope, element, attrs, ngModel) {
        var content,
            templateHidden = '<div class="color-picker-wrapper body hide">',
            templateInline = '<div class="color-picker-wrapper">',
            requests = [$templateRequest(TRIGGER_TEMPLATE_NAME), $templateRequest(TEMPLATE_NAME)];

        $q.all(requests).then(function(tmpls){
          var templateTinyTrigger = tmpls[0];
          var template = tmpls[1];

          var mutator = new DriverMutator($compile, $window, scope);
          var d = new Driver().init(element, $window, scope);
          var pd,td;
          var bd = mutator.fromElement(BodyDriver, angular.element(document.body));
          if (scope.tinyTrigger !== undefined && scope.tinyTrigger === 'true') {
            templateTinyTrigger = templateTinyTrigger.replace('picker-icon', 'picker-icon trigger');
            td = mutator.fromTemplate(TriggerDriver, templateTinyTrigger);
            mutator.replaceWith(d, td);

            template = templateHidden + template;
            pd = mutator.fromElement(PickerDriver, angular.element(template));
            pd.bindAction('click', ngModel, {propagate: true});
            mutator.append(bd, pd);
            td.bindAction('click', pd, {findWrapper: function($target) {
              return closest($target, 'color-picker-wrapper');
            }});
          } else {
            if (element[0].tagName === 'INPUT') {

              template = templateHidden + template;
              pd = mutator.fromElement(PickerDriver, angular.element(template));
              pd.bindAction('click', ngModel, {propagate: false, cont: function(color){
                d.syncColor(color);
              }});
              mutator.append(bd, pd);
              //show color picker beneath the input
              d.bindAction('click', pd);

              td = mutator.fromTemplate(TriggerDriver, templateTinyTrigger);
              mutator.append(d, td);
              //show color picker beneath the input
              td.bindAction('click', pd, {findWrapper: function($target){
                var $wrapper = closest($target, 'color-picker-wrapper');
                return previous($wrapper[0]);
              }});
              $compile(content)(scope);
            } else {
              //replace element with the color picker
              template = templateInline + template;
              pd = mutator.fromElement(PickerDriver, angular.element(template));
              mutator.replaceWith(d, pd);
              pd.bindAction('click', ngModel, {propagate: false});
            }
          }
          //when clicking somewhere on the screen / body -> hide the color picker
          bd.bindAction('click');
        });
      }
    };
  };
  directive.$inject = ["$compile","$document", "$window", "$templateCache", "$templateRequest", "$q"];
  angular.module('colorpicker-dr', []).directive('colorPicker', directive);
}());
