import '../../css/about/about.css';
import _ from 'lodash';
import a from  '../common/index.js';
const obj = _.defaults({ 'a': 1 }, { 'a': 3, 'b': 2 });
console.log(obj, 'obj')
const about = () => {
	console.log('about')
	a()
}
about()