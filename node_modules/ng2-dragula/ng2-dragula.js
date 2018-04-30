"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var core_1 = require('@angular/core');
var dragula_directive_1 = require('./components/dragula.directive');
var dragula_provider_1 = require('./components/dragula.provider');
__export(require('./components/dragula.provider'));
__export(require('./components/dragula.directive'));
var DragulaModule = (function () {
    function DragulaModule() {
    }
    DragulaModule = __decorate([
        core_1.NgModule({
            exports: [dragula_directive_1.DragulaDirective],
            declarations: [dragula_directive_1.DragulaDirective],
            providers: [dragula_provider_1.DragulaService]
        }), 
        __metadata('design:paramtypes', [])
    ], DragulaModule);
    return DragulaModule;
}());
exports.DragulaModule = DragulaModule;
