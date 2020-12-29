const test = require("ava");
const tvmaze = require('./tvmaze-api-helper');
const comp = tvmaze.tvShowComparator;

test('check Tv Shows sorting by rating function', t=>{
    let tvShows = [
        ["tvShow1", "a", 2.2, "a", "a"],
        ["tvShow2", "b", 10.3, "b", "b"],
        ["tvShow3", "c", 1.7, "c", "c"],
        ["tvShow4", "d", 4.55, "d", "d"]
    ]
    t.deepEqual([
        ["tvShow2", "b", 10.3, "b", "b"],
        ["tvShow4", "d", 4.55, "d", "d"],
        ["tvShow1", "a", 2.2, "a", "a"],
        ["tvShow3", "c", 1.7, "c", "c"],
    ], tvShows.sort(comp));
});