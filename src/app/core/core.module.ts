import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {HeaderComponent} from "../header/header.component";
import {FooterComponent} from "../footer/footer.component";



@NgModule({
  declarations: [
    HeaderComponent,FooterComponent
  ],
  imports: [
    CommonModule,ReactiveFormsModule
  ],
  exports: [
    //component
    HeaderComponent,FooterComponent,
    //Others
    ReactiveFormsModule,
  ]
})
export class CoreModule { }
