import { AllCandidate } from './allcandidate';
import { EmailTemplate } from './emailTemplate';
import {FileUploader} from 'ng2-file-upload';
import { Component, OnInit,Input,ElementRef, ViewChild } from '@angular/core';
import {Observable} from 'rxjs';
import { WebService } from './../web.service';
import { map } from 'rxjs/operators';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as fileSaver from 'file-saver';
import {DownloadService} from './../download.service';
import { FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { phoneNumberValidator } from '../validators/phone-validators';


@Component({
  selector: 'app-modal-newroundornot',
  templateUrl: './EmailTemplate.html',
})
export class newEmailTemplate{
@Input() tempTemplate;
templates$: Observable<string[]>;

  newTemplateForm = this.fb.group({
    emailTemplateName: ['', Validators.required],
    emailSubject: ['', Validators.required],
    emailTemplateContent: ['', Validators.required]
  });
  constructor(private fb: FormBuilder, public newEmailTemplateModal: NgbActiveModal, private ws: WebService,
    private modalService: NgbModal ) {}

  ngOnInit() {

  }

  close(){
    this.newEmailTemplateModal.close('Close click');
  }

  submit(){
    const tempTemplate = new EmailTemplate();
    tempTemplate.emailSubject = this.newTemplateForm.get('emailSubject').value;
    tempTemplate.emailTemplateName = this.newTemplateForm.get('emailTemplateName').value;
    tempTemplate.emailTemplateContent = this.newTemplateForm.get('emailTemplateContent').value;
    this.ws.PostNewTemplate(tempTemplate).subscribe((result) => {console.log('a'); } );
    this.tempTemplate.push(tempTemplate.emailTemplateName);
    this.newEmailTemplateModal.close('Close click');

  }
}

@Component({
  selector: 'app-modal-newroundornot',
  templateUrl: './candidateModal.html',
})

export class newCandidate{
  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;

  templates$: Observable<string[]>;
  templates: string[];
  positions$: Observable<string[]>;
  positions: string[];
  newCandidateForm = this.fb.group({
    comment: [''],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    emailTemplateName: ['', Validators.required],
    cellPhone: ['', [Validators.required, phoneNumberValidator, Validators.maxLength(10)]],
    positionName: ['', Validators.required],
    resource: ['', Validators.required],
    resumeFileLocation: [''],
  });

  uploader: FileUploader;
  isDropOver: boolean;

  constructor(private fb: FormBuilder, public newCandidateModal: NgbActiveModal, private ws: WebService,
    private modalService: NgbModal) {}

  ngOnInit () {
    this.templates$ = this.ws.getTemplatename()
    .pipe(map(data => data));
    this.templates$.subscribe(data => this.templates = data);
    this.positions$ = this.ws.getPosition()
    .pipe(map(data => data));
    this.positions$.subscribe(data => this.positions = data);
    const headers = [{name: 'Accept', value: 'application/json'}];
    this.uploader = new FileUploader({url: 'api/files', autoUpload: true, headers: headers});
    this.uploader.onCompleteAll = () => alert('File uploaded');

  }
  fileOverAnother(e: any): void {
    this.isDropOver = e;
  }

  fileClicked() {
    this.fileInput.nativeElement.click();
  }

  close(){
    this.newCandidateModal.close('Close click');
  }
  createNewTemplate(){
    if(this.newCandidateForm.get('emailTemplateName').value === 'new'){
      const modalRef = this.modalService.open(newEmailTemplate);
      modalRef.componentInstance.tempTemplate=this.templates;
    }
  }


  submit(){
    const newCandidate: AllCandidate = new AllCandidate();
    newCandidate.email = this.newCandidateForm.get('email').value;
    newCandidate.emailTemplateName = this.newCandidateForm.get('emailTemplateName').value;
    newCandidate.firstName = this.newCandidateForm.get('firstName').value;
    newCandidate.lastName = this.newCandidateForm.get('lastName').value;
    newCandidate.positionName = this.newCandidateForm.get('positionName').value;
    newCandidate.resource = this.newCandidateForm.get('resource').value;
    newCandidate.cellPhone = this.newCandidateForm.get('cellPhone').value;
    newCandidate.comment = this.newCandidateForm.get('comment').value;
    newCandidate.resumeFileLocation = this.newCandidateForm.get('resumeFileLocation').value;
    this.ws.postNewCandidate(newCandidate).subscribe((result) => {console.log('a'); } );
    this.newCandidateModal.close('Close click');
    window.location.reload();
  }
}

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.css']
})
export class CandidateComponent implements OnInit {
  candidate$: Observable<AllCandidate[]>;
  candidates: AllCandidate[];
  tempCandidates: AllCandidate[];
  page: number;
  pages: number[];
  candidateSet: Set<number>;
  constructor(private fb: FormBuilder, private ws: WebService, private modalService: NgbModal,
    private downloadService: DownloadService) {
    this.candidateSet = new Set();
    this.candidates = [];
    this.page = 0 ;
  }
  downloadFileSystem(file) {
    this.downloadService.downloadFileSystem(file)
      .subscribe(response => {
        const filename = response.headers.get('filename');

        this.saveFile(response.body, filename);
      });
  }
  saveFile(data: any, filename?: string) {
    const blob = new Blob([data], {type: 'text/pdf; charset=utf-8'});
    fileSaver.saveAs(blob, filename);
  }
  ngOnInit() {
    this.page=0;
    this.candidate$ = this.ws.getCandidate()
    .pipe(map(data => data));
    this.candidate$.subscribe(data => this.candidates = data
      .sort((a, b) => a.createDate < b.createDate ? -1 : a.createDate > b.createDate ? 1 : 0)
      );
  }
  checkCandiate(candidateID){
    if (this.candidateSet.has(candidateID)){
      this.candidateSet.delete(candidateID);
    } else
    {
      this.candidateSet.add(candidateID);
    }
  }
  addCandiate(candidateID){
    const candidateArray: number []= [];
    candidateArray.push(candidateID);
    this.ws.postMyCandidate(candidateArray).subscribe((result) => {console.log('a')});
    }
    orderByEmployee(){
    this.page=0;
    this.candidates.sort((a, b) => a.employeeFirstName < b.employeeFirstName ? -1 : a.employeeFirstName > b.employeeFirstName ? 1 : 0);
    }

  orderByDate(){
    this.page=0;
    this.candidates.sort((a, b) => a.createDate < b.createDate ? -1 : a.createDate > b.createDate ? 1 : 0);
  }
  orderByPosition(){
    this.page=0;
    this.candidates.sort((a, b) => a.positionName < b.positionName ? -1 : a.positionName > b.positionName ? 1 : 0);
  }
  orderByFirstName(){
    this.page=0;
    this.candidates.sort((a, b) => a.firstName < b.firstName ? -1 : a.firstName > b.firstName ? 1 : 0);
  }
  orderByLastName(){
    this.page=0;
    this.candidates.sort((a, b) => a.lastName < b.lastName ? -1 : a.lastName > b.lastName ? 1 : 0);

  }
  addAllCandidate(){
    const candidateArray: number[] =  Array.from(this.candidateSet.values());
    this.ws.postMyCandidate(candidateArray).subscribe((result) => {console.log('a')});
  }
  createNewCandidate(){
    const modalRef = this.modalService.open(newCandidate);
  }

  string2Date(date: string){return new Date(date);}


  temp(){
    this.tempCandidates=this.candidates.slice(
      this.page, Math.min(this.page+20,
        this.candidates.length));
    return this.tempCandidates
  }
  jump(i:number){
    this.page=(i-1)*20
}
    getPages(){
this.pages=[];
for(var i=1;i<=Math.floor(this.candidates.length / 20)+1;i++){
   this.pages.push(i);
 }
return this.pages;
}
next(){
 this.page=this.page+20;
}
previous(){
 this.page=this.page-20;
}

}

