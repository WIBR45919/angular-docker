import { NgModule } from '@angular/core';

import { PrivateRoutingModule } from './private-routing.module';
import { PrivateComponent } from './private.component';
import {SharedModule} from "../shared/shared.module";


@NgModule({
  declarations: [
    PrivateComponent
  ],
  imports: [
    SharedModule,
    PrivateRoutingModule
  ]
})
export class PrivateModule { }
