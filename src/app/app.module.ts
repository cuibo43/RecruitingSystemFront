import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';



import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { InterviewComponent, NgbdModalContent , NewRoundOrNot} from './interview/interview.component';
import { CandidateComponent, newCandidate , newEmailTemplate} from './candidate/candidate.component';
import { MyCandidateComponent, SendEmail} from './my-candidate/my-candidate.component';



import { HomeService } from './home/home.service';
import { WebService } from './web.service';
import { InterviewService } from './interview/interview.service';






@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InterviewComponent,
    NgbdModalContent,
    NewRoundOrNot,
    CandidateComponent,
    newCandidate,
    MyCandidateComponent,
    newEmailTemplate,
    SendEmail
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [HomeService, WebService, InterviewService],
  bootstrap: [AppComponent],
  entryComponents: [NgbdModalContent, NewRoundOrNot, newCandidate, newEmailTemplate, SendEmail]
})
export class AppModule { }