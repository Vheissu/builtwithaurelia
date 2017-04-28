import { autoinject } from 'aurelia-dependency-injection';
import { TaskQueue } from 'aurelia-task-queue';
import { Api } from './api';

declare var firebase;

@autoinject
export class Submissions {

  private submissions: any[] = [];
  private editMode: boolean = false;

  constructor(private api: Api, private taskQueue: TaskQueue) {

  }

  determineActivationStrategy() {
    return 'replace';
  }

  canActivate() {
    return new Promise((resolve, reject) => {
      this.taskQueue.queueMicroTask(() => {
        return this.api.getCurrentUserSubmissions().then((submissions: any[]) => {
          this.submissions = submissions;
          resolve(true);
        });
      });
    });
  }

  activate(params) {
    if (params.key !== undefined) {
      this.editMode = true;
    }
  }

}
