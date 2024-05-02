import { Component, OnInit } from '@angular/core';
import { CreateMCQuestionForChoicesAnswer, createProblemSet, createQuestion, postNewProblemSet } from 'src/app/@models/problem-set.model';
import { ProblemSetServiceApiService } from 'src/app/@services-api/problem-set-service-api.service';
import { ScriptService } from 'src/app/@services/script.service';
import { SweetalertService } from 'src/app/@services/sweetalert.service';

@Component({
  selector: 'app-create-problem-set',
  templateUrl: './create-problem-set.component.html',
  styleUrls: ['./create-problem-set.component.scss']
})
export class CreateProblemSetComponent implements OnInit {
  createProblemSet: createProblemSet = {
    problemSetName: "",
    problemSetDescription: "",
    errorMessageProblemSetName: "",
    errorMessageProblemSetDescription: "",
    editingProblemSetName: true,
    editingProblemSetDescription: true
  };

  createDataValue: createQuestion[] = [];

  postNewProblemSet: postNewProblemSet = {
    problemSet: {
      problemSetName: "",
      problemSetDescription: "",
      errorMessageProblemSetName: "",
      errorMessageProblemSetDescription: "",
      editingProblemSetName: true,
      editingProblemSetDescription: true
    },
    question: []
  };

  constructor(private scriptService: ScriptService, private problemSetServiceApiService: ProblemSetServiceApiService, private sweetalertService: SweetalertService) { }

  ngOnInit(): void {
    this.addQuestion();
  }

  addQuestion() {
    let choice: CreateMCQuestionForChoicesAnswer = {
      choices: "",
      editing: true
    };

    let value: createQuestion = {
      questionListChoice: [],
      questionListQuestion: "",
      questionListAnswer: "",
      questionListTypeName: 'Multiple Choice',
      checkAccept: true,
      errorMessage: "",
      editingQuestion: true,
      editingAnswer: true
    };

    value.questionListChoice.push(choice);

    this.createDataValue.push(value);
  }

  problemSetName() {
    if (this.createProblemSet.problemSetName.trim() == "") {
      this.sweetalertService.dialog("The problem set name should not be empty!")
    } else {
      this.createProblemSet.editingProblemSetName = !this.createProblemSet.editingProblemSetName;
    }

  }

  problemSetDescription() {
    this.createProblemSet.editingProblemSetDescription = !this.createProblemSet.editingProblemSetDescription;
  }

  question(index: number) {
    if (this.createDataValue[index].questionListQuestion.trim() == "") {
      this.sweetalertService.dialog("The question should not be empty!")
    } else {
      this.createDataValue[index].editingQuestion = !this.createDataValue[index].editingQuestion;
    }
  }

  answer(index: number) {
    if (this.createDataValue[index].questionListAnswer.trim() == "") {
      this.sweetalertService.dialog("The answer should not be empty!")
    } else {
      this.createDataValue[index].editingAnswer = !this.createDataValue[index].editingAnswer;
    }
  }

  deleteQuestion(index: number) {
    if (this.createDataValue.length > 1) {
      this.createDataValue.splice(index, 1);
    } else {
      this.sweetalertService.dialog("The problem set must have at least one question!")
    }
  }

  choiceMC(indexI: number, indexJ: number) {
    if (this.createDataValue[indexI].questionListChoice[indexJ].choices.trim() == "") {
      this.sweetalertService.dialog("The choice should not be empty!")
    } else {
      this.createDataValue[indexI].questionListChoice[indexJ].editing = !this.createDataValue[indexI].questionListChoice[indexJ].editing;
    }
  }

  deleteMC(indexI: number, indexJ: number) {
    if (this.createDataValue[indexI].questionListChoice.length > 1) {
      this.createDataValue[indexI].questionListChoice.splice(indexJ, 1);
    } else {
      this.sweetalertService.dialog("The multiple-choice answer must have at least one option!")
    }
  }

  addChoice(index: number) {
    let choice: CreateMCQuestionForChoicesAnswer = {
      choices: "",
      editing: true
    };
    this.createDataValue[index].questionListChoice.push(choice);
  }

  Submit() {
    let checkAcceptThisSubmit: boolean = true;
    //check question.
    this.createProblemSet.errorMessageProblemSetName = "";
    this.createProblemSet.errorMessageProblemSetDescription = "";

    this.createProblemSet.problemSetName = this.createProblemSet.problemSetName.trim();
    if (this.createProblemSet.problemSetName == "") {
      checkAcceptThisSubmit = false;
      this.createProblemSet.errorMessageProblemSetName = this.createProblemSet.errorMessageProblemSetName + "The problem set name cannot be empty. <br/>"
    }
    if (this.createProblemSet.editingProblemSetName) {
      checkAcceptThisSubmit = false;
      this.createProblemSet.errorMessageProblemSetName = this.createProblemSet.errorMessageProblemSetName + "Please save. <br/>"
    }
    if (this.createProblemSet.editingProblemSetDescription) {
      checkAcceptThisSubmit = false;
      this.createProblemSet.errorMessageProblemSetDescription = this.createProblemSet.errorMessageProblemSetDescription + "Please save. <br/>"
    }
    //check answer
    for (let i = 0; i < this.createDataValue.length; i++) {
      this.createDataValue[i].checkAccept = false;
      this.createDataValue[i].errorMessage = "";

      for (let j = 0; j < this.createDataValue[i].questionListChoice.length; j++) {
        if (this.createDataValue[i].questionListAnswer == this.createDataValue[i].questionListChoice[j].choices) {
          this.createDataValue[i].checkAccept = true;
        }
        if(this.createDataValue[i].questionListChoice[j].editing){
          checkAcceptThisSubmit = false;
          this.createDataValue[i].errorMessage = this.createDataValue[i].errorMessage + "Please save. <br/>"
        }
      }

      if (this.createDataValue[i].checkAccept == false) {
        checkAcceptThisSubmit = false;
        this.createDataValue[i].errorMessage = this.createDataValue[i].errorMessage + "There is no choice that corresponds to the correct answer. <br/> "
      }
    }
    if (checkAcceptThisSubmit) {
      console.log('OK');
      this.postNewProblemSet.problemSet = this.createProblemSet;
      if (this.createDataValue.length > 0) {
        this.postNewProblemSet.question = this.createDataValue;
      } else {
        this.postNewProblemSet.question = [];
      }
      console.log("this.postNewProblemSet", this.postNewProblemSet);

      this.problemSetServiceApiService.postCreateProblem(this.postNewProblemSet).subscribe((data: any) => {
        console.log(data)
        this.sweetalertService.onSuccessfulActionNavigate("/home/myproblemset")
      });
    }
  }
}
