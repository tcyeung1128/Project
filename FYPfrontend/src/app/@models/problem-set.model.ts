export interface createNewProblemSet {

}

export interface problemSetItem {
    personal_information_guid_fk: string;
    problem_set_description: string;
    problem_set_guid: string;
    problem_set_name: string;
    isMyProblemSet: boolean;
    isSubscribe: boolean;
    questionListCount: number;
}

export interface postStartProblemSet {
    guid: string;
    setProblemSet: string;
    setProblemNumber: number;
}

export interface answerData {
    problemSetGuid: string;
    questionListGuid: string;
    questionNumber: number;
    answer: string;
}

export interface createProblemSet {
    problemSetName: string;
    problemSetDescription: string;
    errorMessageProblemSetName: string;
    errorMessageProblemSetDescription: string;
    editingProblemSetName: boolean;
    editingProblemSetDescription: boolean;
}

export interface CreateMCQuestionForChoicesAnswer {
    choices: string;
    editing: boolean;
}

export interface createQuestion {
    questionListChoice: CreateMCQuestionForChoicesAnswer[];
    questionListQuestion: string;
    questionListAnswer: string;
    questionListTypeName: string;
    checkAccept: boolean;
    errorMessage: string;
    editingQuestion: boolean;
    editingAnswer: boolean;

}

// export interface tempCreateQuestionData{
//     questionListQuestion:string;
//     questionListAnswer:string;
//     choices:string;
// }

export interface postNewProblemSet {
    problemSet: createProblemSet;
    question: createQuestion[];
}