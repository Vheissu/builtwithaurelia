import {autoinject, noView} from 'aurelia-framework';

import {Api} from './api';
import {slugify} from './common';

@autoinject
export class Feed {

    private api: Api;
    items = [];

    constructor(api: Api) {
        this.api = api;
    }

    attached() {
        this.fetchItems().then((items) => {
            document.write(`<?xml version="1.0" encoding="utf-8"?>
                <rss version="2.0">
                    <channel>
                        <title>Built With Aurelia</title>
                        <link>http://builtwithaurelia.com/</link>
                        <description>Latest submissions added to Built With Aurelia.</description>
                        ${items}
                    </channel>
                </rss>`);
        });
    }

    fetchItems() {
        return new Promise((resolve, reject) => {
            this.api.getProjectsFromFirebase().then((projects: any) => {
                if (projects) {
                    for (let project in projects) {
                        let actualProject = projects[project];

                        this.items.push(this.createItem(
                            actualProject.name,
                            'builtwithaurelia.com',
                            `builtwithaurelia.com/${slugify(actualProject.name)}`,
                            '',
                            actualProject.description
                        ));
                    }

                    resolve(this.items.join(''));
                }
            });
        });
    }

    private createItem($title, $link, $guid, $pubDate, $description): string {
        return `
            <item>
                <title>${$title}</title>
                <link>${$link}</link>
                <guid>${$guid}</guid>
                <pubDate>${$pubDate}</pubDate>
                <description>${$description}</description>
            </item>
        `;
    }

}
