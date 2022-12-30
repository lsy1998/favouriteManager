import { defineStore } from 'pinia';
import { item } from '../models/myModel'

export const useLinkListStore = defineStore('linkList', {

    state: () => ({
        linkList: [] as item[],
    }),
    getters: {
        doubleCount: (state) => {
            state.linkList = [{
                linkTitle: "linkTitle2",
                link: "link2"
            }]
        }
    },
    actions: {
        increment() {
            this.linkList = [];
        },
    },
});


