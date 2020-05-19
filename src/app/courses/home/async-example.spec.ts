import { fakeAsync, tick, flush, flushMicrotasks } from '@angular/core/testing';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';




describe('Async Testing Example', () => {

    // USING DONE FUNCTION FOR ASYNC FUNCTIONS
    it('Async test example with Jasmine done()', (done: DoneFn) => {
        let test = false;
        setTimeout(() => {
            console.log('running assertions');
            test = true;
            expect(test).toBeTruthy();
            done();
        }, 1000);
    });


    // USING FAKEASYNC() AND ADVANCING TIME WITH TICK()
    it('Async test example with fakeAsync() with single tick()', fakeAsync(() => {
        let test = false;
        setTimeout(() => {
            console.log('running assertions');
            test = true;
            expect(test).toBeTruthy();
        }, 1000);
        // ending time and executing setimeout
        tick(1000)
    }));


    // USING FAKEASYNC() AND ADVANCING TIME WITH MUTLIPLE TICK()
    it('Async test example with fakeAsync() with multiple tick()', fakeAsync(() => {
        let test = false;
        setTimeout(() => {
            console.log('running assertions');
            test = true;
            expect(test).toBeTruthy();
        }, 1000);
        tick(500)
        // Add functions required before timeout ends
        tick(400);
        // Add other remaining functions required before timeout ends
        tick(100);
    }));


    // USING FLUSH FOR ALL ASYNC FUNCTION EXECUTION WITHOUT ANYTIME BOUNDARY
    it('Async test example with fakeAsync() with flush()', fakeAsync(() => {
        let test = false;
        setTimeout(() => {})
        setTimeout(() => {})
        setTimeout(() => {})
        setTimeout(() => {
            console.log('running assertions');
            test = true;
            expect(test).toBeTruthy();
        }, 1000);

        // ending all timeouts with flush
        flush();
    }));

    // USING FLUSHMICROTASK TO RESOLVE MULTIPLE PROMISES
    it('Asynchronous test example - plain Promise', fakeAsync(() => {

        let test = false;
        console.log('Creating promise');
        Promise.resolve().then(() => {
            console.log('Promise first then() evaluated successfully');
            return Promise.resolve();
        })
        .then(() => {
            console.log('Promise second then() evaluated successfully');
            test = true;
        });
        flushMicrotasks();
        console.log('Running test assertions');
        expect(test).toBeTruthy();
    }));


    it('Asynchronous test example - Promises + setTimeout()', fakeAsync(() => {
        let counter = 0;
        Promise.resolve()
            .then(() => {
               counter+=10;
               setTimeout(() => {
                   counter += 1;
               }, 1000);
            });
        expect(counter).toBe(0);
        flushMicrotasks();
        expect(counter).toBe(10);
        tick(500);
        expect(counter).toBe(10);
        tick(500);
        expect(counter).toBe(11);
    }));


    it('Asynchronous test example - Observables', fakeAsync(() => {
        let test = false;
        console.log('Creating Observable');
        const test$ = of(test).pipe(delay(1000));
        test$.subscribe(() => {
            test = true;
        });
        tick(1000);
        console.log('Running test assertions');
        expect(test).toBe(true);
    }));


});