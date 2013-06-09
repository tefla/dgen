/*global describe, beforeEach, it, expect */

require(['dgen'], function(dgen) {
    'use strict';
    describe('Normalizers', function() {
        it('minmax', function () {
            var norm = new dgen.norms.Minmax(10, 20);
            var data = [0, 0.1, 0.5, 1];
            expect(norm.normalize(data)).toEqual([10, 11, 15, 20]);
        });
        it('sum', function () {
            var norm = new dgen.norms.Sum(1);
            var data = [1, 4, 5];
            expect(norm.normalize(data)).toEqual([0.1, 0.4, 0.5]);
        });
    });
});
