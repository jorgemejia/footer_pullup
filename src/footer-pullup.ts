import {Component, Input, ElementRef, Renderer} from '@angular/core';
import {Platform, DomController, IonicModule} from 'ionic-angular';
//import { DrawerTab } from './content-drawer-tab';
//import {CommonModule} from "@angular/common";

/**
 * Generated class for the Pullup component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */


@Component({
  selector: 'footer-pullup',
  templateUrl: 'footer-pullup.html',
})
export class ContentDrawerComponent {

    @Input('options') options: any;

    handleHeight: number = 50;
    bounceBack: boolean = true;
    thresholdTop: number = 200;
    thresholdBottom: number = 200;

  constructor(public element: ElementRef, public renderer: Renderer, public domCtrl: DomController, public platform: Platform) {

  }
    ngAfterViewInit() {


        if(this.options.handleHeight){
            this.handleHeight = this.options.handleHeight;
        }

        if(this.options.bounceBack){
            this.bounceBack = this.options.bounceBack;
        }

        if(this.options.thresholdFromBottom){
            this.thresholdBottom = this.options.thresholdFromBottom;
        }

        if(this.options.thresholdFromTop){
            this.thresholdTop = this.options.thresholdFromTop;
        }

        if(this.options.menuActive){
            this.renderer.setElementStyle(this.element.nativeElement, 'top', this.options.compHeight + 'px')
            this.renderer.setElementStyle(this.element.nativeElement, 'padding-top', this.handleHeight + 'px');
        }else{
            this.renderer.setElementStyle(this.element.nativeElement, 'top', this.platform.height() - this.handleHeight + 'px');
            this.renderer.setElementStyle(this.element.nativeElement, 'padding-top', this.handleHeight + 'px');
        }



        let hammer = new window['Hammer'](this.element.nativeElement);
        hammer.get('pan').set({ direction: window['Hammer'].DIRECTION_VERTICAL });

        hammer.on('panstart', (ev)=>{
            let oldClass = this.options.domElement._elementRef.nativeElement.className;
            if(this.options.domElement._elementRef.nativeElement.className == 'scroll'){
                this.options.domElement._elementRef.nativeElement.className = oldClass.replace("scroll", "no-scroll");
            }
        });

        hammer.on('pan', (ev) => {
            this.handlePan(ev);

            let oldClass = this.options.domElement._elementRef.nativeElement.className;
            if(this.options.domElement._elementRef.nativeElement.className == 'scroll'){
                this.options.domElement._elementRef.nativeElement.className = oldClass.replace("scroll", "no-scroll");
            }

    
       });

        hammer.on('panend', (ev) => {
            this.cancelPan(ev);
            let oldClass = this.options.domElement._elementRef.nativeElement.className;
            if(this.options.domElement._elementRef.nativeElement.className == 'no-scroll'){
                this.options.domElement._elementRef.nativeElement.className = oldClass.replace("no-scroll", "scroll");
            }
        });


    }

    cancelPan(ev){

       let newTop = ev.center.y;

       if(newTop <= 576){
           this.domCtrl.write(() => {
               this.renderer.setElementStyle(this.element.nativeElement, 'transition', 'top 0.5s');
               this.renderer.setElementStyle(this.element.nativeElement, 'top', this.options.compHeight + 'px');
           });
       }else{
           this.domCtrl.write(() => {
               this.renderer.setElementStyle(this.element.nativeElement, 'transition', 'top 0.5s');
               this.renderer.setElementStyle(this.element.nativeElement, 'top', this.platform.height() - this.handleHeight + 'px');
           });
       }
    }

    handlePan(ev){

        let newTop = ev.center.y;
        let bounceToBottom = false;
        let bounceToTop = false;

        if(this.bounceBack && ev.isFinal){

            let topDiff = newTop - this.thresholdTop;
            let bottomDiff = (this.platform.height() - this.thresholdBottom) - newTop;

            topDiff >= bottomDiff ? bounceToBottom = true : bounceToTop = true;

        }
        if((newTop < this.thresholdTop && ev.additionalEvent === "panup") || bounceToTop){

            this.domCtrl.write(() => {
                this.renderer.setElementStyle(this.element.nativeElement, 'transition', 'top 0.5s');
                this.renderer.setElementStyle(this.element.nativeElement, 'top', this.options.compHeight + 'px');
            });

        } //else if(((this.platform.height() - newTop) < this.thresholdBottom && ev.additionalEvent === "pandown") || bounceToBottom){
          else if(( newTop < this.thresholdBottom && ev.additionalEvent === "pandown") || bounceToBottom){
            this.domCtrl.write(() => {
                this.renderer.setElementStyle(this.element.nativeElement, 'transition', 'top 0.5s');
                this.renderer.setElementStyle(this.element.nativeElement, 'top', this.platform.height() - this.handleHeight + 'px');
            });

        } else {

            this.renderer.setElementStyle(this.element.nativeElement, 'transition', 'none');

            if(newTop > 0 && newTop < (this.platform.height() - this.handleHeight)) {

                if(ev.additionalEvent === "panup" || ev.additionalEvent === "pandown"){

                    if(ev.additionalEvent === "pandown" && newTop > this.options.compHeight){
                        this.domCtrl.write(() => {
                            this.renderer.setElementStyle(this.element.nativeElement, 'top', newTop + 'px');
                        });
                    }else if(ev.additionalEvent === "panup"){
                        this.domCtrl.write(() => {
                            this.renderer.setElementStyle(this.element.nativeElement, 'top', newTop + 'px');
                        });
                    }

                }

            }

        }

    }

}
