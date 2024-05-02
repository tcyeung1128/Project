import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-problem-set-card',
  templateUrl: './problem-set-card.component.html',
  styleUrls: ['./problem-set-card.component.scss']
})
export class ProblemSetCardComponent {
  @Input() problem_set_name:string='';
  @Input() problem_set_description:string='';
}
