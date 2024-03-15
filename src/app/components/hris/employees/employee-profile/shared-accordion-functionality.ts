import { Component, EventEmitter, HostListener, Input, OnInit, Output, NgModule } from '@angular/core';


export class sharedAccordionFunctionality {

    screenWidth = window.innerWidth;

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.screenWidth = window.innerWidth;
    }

}