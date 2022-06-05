// Queue class to be used in BFS algorithm
export class Queue {
    
    // two-stack implementation
    stackIn: any[];
    stackOut: any[];

    /**
     *  Creates an empty Queue object
     */
    constructor() {
        this.stackIn = [];
        this.stackOut = [];
    }

    /**
     *  adds @val to the back of the queue
     */
    public enqueue(val) {
        this.stackIn.push(val);
    }

    /**
     *  pops out the value at the front of the queue and return it
     */
    public dequeue() {
        if (this.stackOut.length == 0) {
            while (this.stackIn.length > 0) {
                this.stackOut.push(this.stackIn.pop());
            }
        }
        return this.stackOut.pop();
    }

    /**
     *  return true if the queue is empty, false otherwise
     */
    public isEmpty() {
        return this.stackIn.length === 0 && this.stackOut.length === 0;
    }
}