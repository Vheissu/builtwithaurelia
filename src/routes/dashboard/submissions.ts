import { ValidationControllerFactory, Validator, ValidationController, ValidationRules } from 'aurelia-validation';
import { autoinject } from 'aurelia-dependency-injection';
import { Api } from '../../services/api';

import { SubmissionInterface } from '../../common/interfaces';

@autoinject
export class Submissions {

    private submissions: SubmissionInterface[] = [];

    private submission: SubmissionInterface = {
        name: null,
        category: null,
        description: '',
        repoUrl: '',
        url: ''
    };

    private editMode: boolean = false;
    public controller: ValidationController;
    public disableButtons: boolean = false;

    constructor(private api: Api, private controllerFactory: ValidationControllerFactory, private validator: Validator) {
        this.controller = controllerFactory.createForCurrentScope();
        this.controller.subscribe(event => this.validateForm(event));

        ValidationRules
            .ensure('description').required()
            .ensure('url').required().when((submission: any) => (submission.repoUrl.trim() === ''))
            .on(this.submission).rules;
    }

    async validateForm(e) {
        const results = await this.validator.validateObject(this.submission);
        console.log(e);
        this.disableButtons = results.every(result => result.valid);
    }

    determineActivationStrategy() {
        return 'replace';
    }

    async canActivate() {
        this.submissions = await this.api.getCurrentUserSubmissions();
    }

    async activate(params) {
        if (params.key !== undefined) {
            this.editMode = true;

            this.submission = await this.api.getSubmission(params.key);

            console.log(this.submission);
        }
    }

    cancelEdit() {
        this.editMode = false;
    }
}
