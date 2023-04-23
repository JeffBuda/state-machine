import {generateState} from '../src/workQueue';

describe('work queue', ()=>{
    it('has some items', ()=>{
        var state = generateState(['jeff', 'dave']);
        expect(state.steps.length).toBeGreaterThan(1); 
    });
});