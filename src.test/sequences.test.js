/*global describe, beforeEach, it, expect */

require(['dgen'], function(dgen) {
    'use strict';

    describe('Constant sequence', function () {
        it('should generate zeros by default', function () {
            var seq = new dgen.seqs.Constant();
            expect(seq.next()).toEqual(0);
            expect(seq.next()).toEqual(0);
        });
        it('should accept contant as a constructor parameter', function() {
            var seq = new dgen.seqs.Constant(5);
            expect(seq.next()).toEqual(5);
            expect(seq.next()).toEqual(5);
        });
        it('should allow to set constant to generate', function () {
            var seq = new dgen.seqs.Constant();
            seq.setConstant(5);
            expect(seq.next()).toEqual(5);
            expect(seq.next()).toEqual(5);
        });
    });
    describe('Cycle sequence', function() {
        it('should cycle between zero and one by default', function () {
            var seq = new dgen.seqs.Cycle();
            expect(seq.next()).toEqual(0);
            expect(seq.next()).toEqual(1);
            expect(seq.next()).toEqual(0);
            expect(seq.next()).toEqual(1);
        });
        it('should accept pattern as a constructor parameter', function() {
            var seq = new dgen.seqs.Cycle([1, 3, 5]);
            expect(seq.next()).toEqual(1);
            expect(seq.next()).toEqual(3);
            expect(seq.next()).toEqual(5);
            expect(seq.next()).toEqual(1);
        });
        it('should allow to set pattern', function () {
            var seq = new dgen.seqs.Cycle();
            seq.setPattern([1, 3, 5]);
            expect(seq.next()).toEqual(1);
            expect(seq.next()).toEqual(3);
            expect(seq.next()).toEqual(5);
            expect(seq.next()).toEqual(1);
        });
    });
    describe('Arithmetic sequence', function () {
        it('should start from zero by default', function () {
            var seq = new dgen.seqs.Arithmetic();
            expect(seq.next()).toEqual(0);
        });
        it('should increase by one by default', function () {
            var seq = new dgen.seqs.Arithmetic();
            expect(seq.next()).toEqual(0);
            expect(seq.next()).toEqual(1);
            expect(seq.next()).toEqual(2);
        });
        it('should accept start and step as constructor parameters', function() {
            var seq = new dgen.seqs.Arithmetic(5, 1.5);
            expect(seq.next()).toEqual(5);
            expect(seq.next()).toEqual(6.5);
            expect(seq.next()).toEqual(8);
        });
        it('should allow to set start value', function () {
            var seq = new dgen.seqs.Arithmetic();
            seq.setStart(5);
            expect(seq.next()).toEqual(5);
            expect(seq.next()).toEqual(6);
            expect(seq.next()).toEqual(7);
        });
        it('should allow to set step value', function () {
            var seq = new dgen.seqs.Arithmetic();
            seq.setStep(1.5);
            expect(seq.next()).toEqual(0);
            expect(seq.next()).toEqual(1.5);
            expect(seq.next()).toEqual(3.0);
        });
    });
    describe('Geometric sequence', function () {
        it('should start from one by default', function () {
            var seq = new dgen.seqs.Geometric();
            expect(seq.next()).toEqual(1);
        });
        it('should increase by common ratio 2 by default', function () {
            var seq = new dgen.seqs.Geometric();
            expect(seq.next()).toEqual(1);
            expect(seq.next()).toEqual(2);
            expect(seq.next()).toEqual(4);
        });
        it('should accept start and ratio as constructor parameters', function() {
            var seq = new dgen.seqs.Geometric(2, -1);
            expect(seq.next()).toEqual(2);
            expect(seq.next()).toEqual(-2);
            expect(seq.next()).toEqual(2);
        });
        it('should allow to set start value', function () {
            var seq = new dgen.seqs.Geometric();
            seq.setStart(5);
            expect(seq.next()).toEqual(5);
            expect(seq.next()).toEqual(10);
            expect(seq.next()).toEqual(20);
        });
        it('should allow to set common ratio', function () {
            var seq = new dgen.seqs.Geometric();
            seq.setRatio(-3);
            expect(seq.next()).toEqual(1);
            expect(seq.next()).toEqual(-3);
            expect(seq.next()).toEqual(9);
        });
    });
    describe('Random sequence', function() {
        it('should accept rng, min and max as constructor parameters', function() {
            var seq = new dgen.seqs.Random(Math.random, 0, 1);
            expect(seq.getRng()).toEqual(Math.random);
            expect(seq.getMin()).toEqual(0);
            expect(seq.getMax()).toEqual(1);
        });
        it('should allow to set boundary', function () {
            var seq = new dgen.seqs.Random();
            seq.setMin(0.2);
            seq.setMax(0.8);

            var min = +Infinity;
            var max = -Infinity;

            for(var i = 0; i < 1000; i++) {
                var cur = seq.next();
                min = min > cur ? cur : min;
                max = max < cur ? cur : max;
            }

            expect(min).toBeGreaterThan(0.19999);
            expect(max).toBeLessThan(0.80001);
        });
    });
    describe('Random walker', function () {
        it('should accept rng, start, min and max as constructor parameters', function() {
            var seq = new dgen.seqs.RandomWalk(Math.random, 0.5, 0, 1);
            expect(seq.getRng()).toEqual(Math.random);
            expect(seq.getStart()).toEqual(0.5);
            expect(seq.getMin()).toEqual(0);
            expect(seq.getMax()).toEqual(1);
        });
        it('should allow to set start value', function () {
            var seq = new dgen.seqs.RandomWalk();
            seq.setStart(0.5);
            expect(seq.next()).toEqual(0.5);
        });
        it('should allow to set boundary', function () {
            var seq = new dgen.seqs.RandomWalk();
            seq.setMin(-5);
            seq.setMax(+5);

            var min = +Infinity;
            var max = -Infinity;

            for(var i = 0; i < 1000; i++) {
                var cur = seq.next();
                min = min > cur ? cur : min;
                max = max < cur ? cur : max;
            }

            expect(min).toBeGreaterThan(-5.0001);
            expect(max).toBeLessThan(+5.0001);
        });
    });
    describe('All sequences', function() {
        it('should have common methods', function() {
            for(var key in dgen.seqs) {
                var seq = new dgen.seqs[key]();
                expect(seq.array).toBeDefined();
                expect(seq.getMap).toBeDefined();
                expect(seq.setMap).toBeDefined();
            }
        });
        it('should accept normalizer as a second parameter of array()', function() {
            var data = new dgen.seqs.Cycle()
                .setPattern([1, 4, 5])
                .array(3, new dgen.norms.Sum(1));
            expect(data).toEqual([0.1, 0.4, 0.5]);
        });
    });
    describe('Composite sequences', function() {
        describe('Combine sequence', function() {
            it('should allow combine sequences', function () {
                var seq = new dgen.seqs.Combine()
                    .add(new dgen.seqs.Arithmetic().setStep(2))
                    .add(new dgen.seqs.Arithmetic().setStep(3));
                expect(seq.next()).toEqual(0 + 0);
                expect(seq.next()).toEqual(2 + 3);
                expect(seq.next()).toEqual(4 + 6);
            });
            it('should accept array of sequences', function () {
                var seq1 = new dgen.seqs.Arithmetic().setStep(2);
                var seq2 = new dgen.seqs.Arithmetic().setStep(3);
                var seq = new dgen.seqs.Combine([seq1, seq2]);
                expect(seq.next()).toEqual(0 + 0);
                expect(seq.next()).toEqual(2 + 3);
                expect(seq.next()).toEqual(4 + 6);
            });
        });
        describe('Repeat sequence', function() {
            it('should repeat two times', function () {
                var repeat = new dgen.seqs.Repeat(new dgen.seqs.Arithmetic());
                expect(repeat.next()).toEqual(0);
                expect(repeat.next()).toEqual(0);
                expect(repeat.next()).toEqual(1);
                expect(repeat.next()).toEqual(1);
            });
            it('should be able to set repeat counter', function () {
                var repeat = new dgen.seqs.Repeat(new dgen.seqs.Arithmetic(), 3);
                expect(repeat.next()).toEqual(0);
                expect(repeat.next()).toEqual(0);
                expect(repeat.next()).toEqual(0);
                expect(repeat.next()).toEqual(1);
                expect(repeat.next()).toEqual(1);
                expect(repeat.next()).toEqual(1);
            });
        });
    });
});
