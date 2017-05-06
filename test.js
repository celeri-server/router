
const { inspect } = require('util');
const { TrieRouter } = require('./build');

const log = (object) => {
	console.log(inspect(object, {
		showHidden: true,
		depth: null,
		colors: true
	}));
};

const router = new TrieRouter();

router.createRoute('get', '/foo');
router.createRoute('get', '/foo/:bar');
router.createRoute('get', '/foo/**');
router.createRoute('get', '/foo/:bar/baz');
router.createRoute('get', '/foo/:qux/bar');
router.createRoute('get', '/foo/bar/baz');

global.log = log;
global.router = router;
