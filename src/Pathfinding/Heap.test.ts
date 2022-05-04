import { Heap } from './Heap';

test('basic heap test', () => {
    const heap: Heap = new Heap((val: number) => val);
    const values: number[] = [10,2,1,5,7];
    heap.insertMany(values);
    expect(heap.pop()).toBe(1);
    expect(heap.length()).toBe(4);
    expect(heap.pop()).toBe(2);
    expect(heap.length()).toBe(3);
    expect(heap.pop()).toBe(5);
    expect(heap.length()).toBe(2);
    expect(heap.pop()).toBe(7);
    expect(heap.length()).toBe(1);
    expect(heap.pop()).toBe(10);
    expect(heap.length()).toBe(0);
});

test('repeated values test', () => {
    const heap: Heap = new Heap((val: number) => val);
    const values: number[] = [1,3,5,3,6,7,3,8,2,2,9,4,3,4]
    const expected: number[] = [...values].sort();
    heap.insertMany(values);
    for (let i = 0; i < expected.length; i++) {
        expect(heap.pop()).toBe(expected[i]);
        expect(heap.length()).toBe(values.length - i - 1);
    }
}) 