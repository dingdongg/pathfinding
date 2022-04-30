import exp from 'constants';
import { Heap } from './Heap';

test('basic heap test', () => {
    const heap: Heap = new Heap((val: number) => val);
    heap.insert(10);
    heap.insert(2);
    heap.insert(1);
    heap.insert(5);
    heap.insert(7);
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