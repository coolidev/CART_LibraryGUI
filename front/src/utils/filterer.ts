export interface Filter {
    (value) : boolean;
};

export class Filterer {

    filters: Map<string, Filter>;
    theList: Array<{filterTags:Set<string>,object:any}>;
    theFilteredList: Array<any>;
 
    constructor(listToFilter : Array<any>) {
        this.filters = new Map();
        this.theList = [];
        this.theFilteredList = listToFilter;
        if(listToFilter == undefined) return;
        listToFilter.forEach(element => {
            this.theList.push({filterTags:new Set(),object:element});
        });
    }

    /**
     * 
     * @returns filters used
     */
    getFilters() {
        return this.filters;
    }

    /**
     * Add filter by unique name.
     * @param {string} filterName 
     * @param {function} filter 
     */
    addFilter(filterName, filter) {
        if(this.filters.has(filterName)) {
            console.log("Filter with this name already exists " + filterName);
            return false;
        }
        this.filters.set(filterName, filter);
        this.theFilteredList = [];
        this.theList = this.theList.map(elt => {
            if(!filter(elt.object)) {
                elt.filterTags.add(filterName);
            }
            if(elt.filterTags.size == 0) {
                this.theFilteredList.push(elt.object);
            }
            return elt;
        });
        return true;
    }


    /**
     * Remove filter by name.
     * @param {string} filterName 
     */
    removeFilter(filterName) {
        if(!this.filters.has(filterName)) {
            console.log("Filter with this name does not exist " + filterName);
            return false;
        }
        this.theFilteredList = [];
        this.theList = this.theList.map(entry => {
            entry.filterTags.delete(filterName);
            if(entry.filterTags.size == 0) {
                this.theFilteredList.push(entry.object);
            }
            return entry;
        });
        this.filters.delete(filterName);
        return true;
    }

    clearFilters() {
        this.filters.clear();
        this.theFilteredList = [];
        this.theList = this.theList.map(entry => {
            entry.filterTags.clear();
            this.theFilteredList.push(entry.object);
            return entry;
        });
        return true;
    }


    /**
     * 
     * @returns The remaining items in the list which have met all filtering requirements
     */
    getFilteredList() {
        return this.theFilteredList;
    }

    // /**
    //  * Add an item to be filtered
    //  * @param {*} item 
    //  */
    // addToList(item) {
    //     let tags = new Set();
    //     this.filters.forEach((filter, filterName) => {
    //         if(!filter(item)) {
    //             tags.add(filterName);
    //         }
    //     });
    //     this.theList.push({filterTags:tags,object:item});
    // }

    // /**
    //  * Remove an item from the to be filtered list
    //  * @param {*} item 
    //  */
    // removeFromList(item) {
    //     this.theList = this.theList.filter(elt => {
    //         return elt.object !== item;
    //     });
    // }


}
