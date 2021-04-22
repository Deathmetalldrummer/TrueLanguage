export class Quest {
    arr = [];
    constructor() {
        for (let i = 10; i < 100; i++) {
            for (let ii = 10; ii < 100; ii++) {
                this.arr.push({
                    value: `${i} + ${ii}`,
                    res: (i + ii).toString()
                });
            }
        }
    }
    getList() {
        return this.arr;
    }
    get() {
        let min = 10;
        let max = this.arr.length;
        min = Math.ceil(min);
        max = Math.floor(max);
        const index = Math.floor(Math.random() * (max - min)) + min;
        return this.arr[index];
    }
}
