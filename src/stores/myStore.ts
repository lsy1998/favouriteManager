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

export const useFavouriteDataStore = defineStore('favouriteData', {

    state: () => ({
        favouriteData: [] as item[],
    }),
    getters: {
        doubleCount: (state) => {
            state.favouriteData = [{
                linkTitle: "linkTitle2",
                link: "link2"
            }]
        }
    },
    actions: {
        increment() {
            this.favouriteData = [];
        },
    },
});

export const useSideBarStore = defineStore('sideBar', {
  state: () => ({
      leftSideBar: false as boolean,
      rightSideBar: false as boolean,
  })
});

export const useBreadcrumbsStore = defineStore('breadcrumbs', {
  state: () => ({
    breadcrumbs: [] as item[]
  })
});

