/**
 * An inmutable Play Queue
 */
export default class PlayQueue {
    /**
     * Creates a new PlayQueue. If `initialValue` is null or undefined will load the contents
     * from the session storage (you should use this behaviour). If it's defined, then the
     * contents are defined from this value and stored into the session storage (used by the
     * class to implement inmutability).
     *
     * The class **is inmutable**, meaning that everything you do doesn't modify the object
     * itself. Instead, returns a copy of the queue with the modification applied.
     * @param {Array} initialValue initial content for the queue (used in general by internal API)
     */
    constructor(initialValue) {
        if(initialValue) {
            this._array = initialValue;
            this._store();
        } else {
            let playQueueJSONString = this._obtain();
            if (playQueueJSONString !== null){
                this._array = playQueueJSONString.filter(entry => entry.title !== null);
                this._store();
            } else {
                this._array = [];
                this._store();
            }
        }
    }

    get values() { return this._array; }

    /**
     * Adds elements to the end of the queue and returns the queue with the changes applied
     * @param {{id: string, title: string | null}} elements The elements to add to the queue
     * @returns PlayQueue with the new elements added
     */
    add(...elements) {
       return new PlayQueue([...this.values, ...elements ]);
    }

    /**
     * Adds a new element to the beginning of the queue and returns a new queue with the changes
     * @param {{id: string, title: string | null}} element The element to add
     * @returns PlayQueue with the new element added
     */
    addFirst(element) {
        return new PlayQueue([ element, ...this.values ]);
    }

    /**
     * Empties the queue
     * @returns A PlayQueue empty
     */
    emptyQueue(){
        return new PlayQueue([]);
    }

    /**
     * Deletes the first element of the queue, if there is at least one item
     * @returns A PlayQueue with the first element removed
     */
    deleteFirst(){
        return this.values.length > 0 ? new PlayQueue(this.values.slice(1)) : this;
    }

    /**
     * Searches the element by its id and removes it from the Queue
     * @param {{id: string}} element Element to remove
     * @returns A PlayQueue with that element removed
     */
    delete(element){
        let index = this.values.findIndex(searchElement => element.id === searchElement.id);
        if (index !== -1) {
            return new PlayQueue(this.values.slice(0, index).concat(this.values.slice(index + 1)));
        } else {
            return this;
        }
    }

    /**
     * Stores the current queue in the session storage
     */
    _store() {
        try {
            window.sessionStorage.setItem("playQueue", JSON.stringify(this._array))
        } catch(e) {}
    }

    /**
     * Parses the stored queue from the session storage
     */
    _obtain() {
        let value = window.sessionStorage.getItem('playQueue');
        return value ? JSON.parse(value) : value;
    }

}