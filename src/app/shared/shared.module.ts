import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import { NotfoundComponent } from '../notfound/notfound.component';

@NgModule({
  declarations: [
    NotfoundComponent
  ],
  imports: [
    CommonModule,FormsModule
  ],
  exports: [
    CommonModule,FormsModule
  ]
})
export class SharedModule { }
