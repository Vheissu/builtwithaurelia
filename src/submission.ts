import {computedFrom, observable} from 'aurelia-framework';

const categories = [
    'website',
    'mobile',
    'plugin',
    'theme'
];

export class Submission {
    formValid: boolean = true;

    fields = {
        name: {
            label: 'Submission Name:',
            required: true,
            isValid: true,
            errorMessage: 'A project name is required',
            value: ''
        },
        category: {
            label: 'Category',
            required: true,
            isValid: true,
            errorMessage: 'A category is required',
            value: ''
        },
        description: {
            label: 'Description',
            required: true,
            isValid: true,
            errorMessage: 'Please enter a brief description',
            value: ''
        },
        url: {
            label: 'Url',
            required: true,
            rules: 'repoUrl == empty',
            isValid: true,
            errorMessage: 'Please enter a URL or fill the repository URL if this has no URL.',
            value: ''
        },
        repoUrl: {
            label: 'Repo Url',
            required: true,
            rules: 'url == empty',
            isValid: true,
            errorMessage: 'A repository URL is required if the Url field is not filled out.',
            value: ''
        }
    };

    handleSubmit() {
        let formValid = true;

        for (let field in this.fields) {
            let actualField = this.fields[field];

            let validField = this.validateFieldWithReturnBoolean(actualField);

            if (!validField) {
                actualField.isValid = false;
            }

            if (formValid && !validField) {
                formValid = false;
            }
        }

        this.formValid = formValid;
    }

    validateField(field) {
        field.isValid = this.validateFieldWithReturnBoolean(field);
    }

    validateFieldWithReturnBoolean(field) {
        let fieldIsValid = true;

        if (field.required) {
            // We have no special validation rules
            if (!field.rules) {
                // Is the field empty?
                // then we need to invalidate it
                if (fieldIsEmpty(field.value)) {
                    fieldIsValid = false;
                } else {
                    fieldIsValid = true;
                }
            } else {
                let rules = field.rules.split(' ');

                // This is an empty check of another field
                if (rules[2] === 'empty') {
                    if (fieldIsEmpty(field.value) && fieldIsEmpty(this.fields[rules[0]].value)) {
                        fieldIsValid = false;
                    } else {
                        fieldIsValid = true;
                    }
                }
            }
        }

        return fieldIsValid;
    }
}

function validCategorySupplied(category) {
    return categories.indexOf(category) !== -1;
}

function fieldIsEmpty(field) {
    return field.trim() === '';
}
